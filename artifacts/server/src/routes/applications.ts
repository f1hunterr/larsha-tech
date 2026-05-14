import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { join, extname, basename } from 'path';
import { mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import db from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const UPLOADS_DIR = process.env.UPLOADS_DIR || join(process.cwd(), 'uploads', 'resumes');
mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_EXTS  = new Set(['.pdf', '.doc', '.docx']);
const ALLOWED_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, _file, cb) => {
    cb(null, `${randomBytes(16).toString('hex')}.bin`); // extension added after MIME check
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTS.has(ext))           { cb(new Error('Only PDF, DOC, and DOCX files are allowed')); return; }
    if (!ALLOWED_MIMES.has(file.mimetype)) { cb(new Error('File type not allowed')); return; }
    cb(null, true);
  },
});

const MAX_LEN = { name: 100, email: 120, phone: 20, position: 80, experience: 30, message: 3000 };

const rateMap = new Map<string, { count: number; resetAt: number }>();
function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  const WINDOW = 60 * 60 * 1000;
  if (!entry || entry.resetAt < now) { rateMap.set(ip, { count: 1, resetAt: now + WINDOW }); next(); return; }
  if (entry.count >= 3) { res.status(429).json({ error: 'Too many submissions. Try again later.' }); return; }
  entry.count++;
  next();
}

// POST /api/applications
router.post('/', rateLimit, (req: Request, res: Response) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'Resume must be under 5 MB' : err.message });
      return;
    }
    if (err) { res.status(400).json({ error: (err as Error).message }); return; }

    const body = req.body as Record<string, unknown>;
    const name       = typeof body.name       === 'string' ? body.name.trim()       : '';
    const email      = typeof body.email      === 'string' ? body.email.trim()      : '';
    const phone      = typeof body.phone      === 'string' ? body.phone.trim()      : '';
    const position   = typeof body.position   === 'string' ? body.position.trim()   : '';
    const experience = typeof body.experience === 'string' ? body.experience.trim() : '';
    const message    = typeof body.message    === 'string' ? body.message.trim()    : '';

    if (!name || !email || !phone || !position || !message) {
      res.status(400).json({ error: 'Required fields are missing' }); return;
    }
    if (!email.includes('@')) { res.status(400).json({ error: 'Invalid email address' }); return; }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
      res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' }); return;
    }
    if (
      name.length > MAX_LEN.name || email.length > MAX_LEN.email ||
      phone.length > MAX_LEN.phone || position.length > MAX_LEN.position ||
      message.length > MAX_LEN.message
    ) { res.status(400).json({ error: 'Input exceeds maximum allowed length' }); return; }

    const result = db.prepare(`
      INSERT INTO applications (name, email, phone, position, experience, message, resume_path, resume_original_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, position, experience, message,
           req.file?.filename ?? null, req.file?.originalname ?? null);

    res.status(201).json({ id: result.lastInsertRowid });
  });
});

// GET /api/applications — list all (admin only)
router.get('/', requireAdmin, (_req, res: Response) => {
  const rows = db.prepare(
    'SELECT id, name, email, phone, position, experience, message, resume_original_name, status, created_at FROM applications ORDER BY created_at DESC'
  ).all();
  res.json(rows);
});

// GET /api/applications/:id/resume — download file (admin only)
router.get('/:id/resume', requireAdmin, (req: Request, res: Response) => {
  const row = db.prepare('SELECT resume_path, resume_original_name FROM applications WHERE id = ?')
    .get(Number(req.params.id)) as { resume_path: string | null; resume_original_name: string | null } | undefined;
  if (!row?.resume_path) { res.status(404).json({ error: 'Resume not found' }); return; }
  // Guard against path traversal: stored filename must contain no path separators
  if (basename(row.resume_path) !== row.resume_path) {
    res.status(400).json({ error: 'Invalid file reference' }); return;
  }
  res.download(join(UPLOADS_DIR, row.resume_path), row.resume_original_name ?? row.resume_path, (err) => {
    if (err) res.status(404).json({ error: 'File not found on disk' });
  });
});

// PATCH /api/applications/:id/status (admin only)
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) { res.status(400).json({ error: 'Invalid application ID' }); return; }
  const status = typeof req.body?.status === 'string' ? (req.body.status as string).trim() : '';
  const allowed = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];
  if (!allowed.includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
  const info = db.prepare('UPDATE applications SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) { res.status(404).json({ error: 'Application not found' }); return; }
  res.json({ ok: true });
});

export default router;
