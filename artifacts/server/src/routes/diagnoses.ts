import { Router, Request, Response, NextFunction } from 'express';
import db from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const rateMap = new Map<string, { count: number; resetAt: number }>();
function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    next(); return;
  }
  if (entry.count >= 5) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' }); return;
  }
  entry.count++;
  next();
}

function str(body: Record<string, unknown>, key: string): string {
  return typeof body[key] === 'string' ? (body[key] as string).trim() : '';
}

// POST /api/diagnoses — submit a free diagnosis request
router.post('/', rateLimit, (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;

  const name          = str(body, 'name');
  const phone         = str(body, 'phone');
  const email         = str(body, 'email');
  const deviceType    = str(body, 'deviceType');
  const brand         = str(body, 'brand');
  const model         = str(body, 'model');
  const powersOn      = str(body, 'powersOn');
  const displayStatus = str(body, 'displayStatus');
  const sounds        = str(body, 'sounds');
  const errorMessages = str(body, 'errorMessages');
  const problemStart  = str(body, 'problemStart');
  const description   = str(body, 'description');
  const tried         = str(body, 'tried');

  if (!name || !phone || !deviceType || !brand || !powersOn || !description) {
    res.status(400).json({ error: 'Required fields are missing' }); return;
  }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' }); return;
  }
  if (name.length > 100 || phone.length > 20 || email.length > 120 ||
      deviceType.length > 50 || brand.length > 50 || description.length > 2000) {
    res.status(400).json({ error: 'Input exceeds maximum allowed length' }); return;
  }

  const result = db.prepare(`
    INSERT INTO diagnoses
      (name, phone, email, device_type, brand, model, powers_on, display_status,
       sounds, error_messages, problem_start, description, tried)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, phone, email, deviceType, brand, model, powersOn, displayStatus,
         sounds, errorMessages, problemStart, description, tried);

  res.status(201).json({ id: result.lastInsertRowid });
});

// GET /api/diagnoses — list all (admin)
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.prepare('SELECT * FROM diagnoses ORDER BY created_at DESC').all());
});

// PATCH /api/diagnoses/:id/status — update status (admin)
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
  const status = typeof req.body?.status === 'string' ? (req.body.status as string).trim() : '';
  const allowed = ['pending', 'reviewed', 'contacted', 'resolved'];
  if (!allowed.includes(status)) { res.status(400).json({ error: 'Invalid status' }); return; }
  const info = db.prepare('UPDATE diagnoses SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) { res.status(404).json({ error: 'Not found' }); return; }
  res.json({ ok: true });
});

export default router;
