import { Router, Request, Response, NextFunction } from 'express';
import db from '../db';

const router = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Tech Admin"');
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const [, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  if (pass !== ADMIN_PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Tech Admin"');
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  next();
}

// POST /api/leads — save a new lead
router.post('/', (req: Request, res: Response) => {
  const { name, phone, service, message } = req.body as Record<string, string>;
  if (!name || !phone || !service || !message) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  const stmt = db.prepare('INSERT INTO leads (name, phone, service, message) VALUES (?, ?, ?, ?)');
  const result = stmt.run(name.trim(), phone.trim(), service.trim(), message.trim());
  res.status(201).json({ id: result.lastInsertRowid });
});

// GET /api/leads — list all leads (admin only)
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

export default router;
