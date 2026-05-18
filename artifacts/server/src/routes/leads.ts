import { Router, Request, Response, NextFunction } from 'express';
import db from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Max field lengths (must match frontend LeadForm validation)
const MAX_LEN = { name: 100, phone: 20, service: 80, message: 2000 };

// Simple in-memory rate limiter: 5 lead submissions per IP per 10 minutes
const rateMap = new Map<string, { count: number; resetAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap.entries()) {
    if (entry.resetAt < now) rateMap.delete(ip);
  }
}, 60_000);
function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const WINDOW = 10 * 60 * 1000;
  const LIMIT = 5;
  const entry = rateMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW });
    next();
    return;
  }
  if (entry.count >= LIMIT) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }
  entry.count++;
  next();
}

// POST /api/leads — save a new lead
router.post('/', rateLimit, (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;
  const name    = typeof body.name    === 'string' ? body.name.trim()    : '';
  const phone   = typeof body.phone   === 'string' ? body.phone.trim()   : '';
  const service = typeof body.service === 'string' ? body.service.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name || !phone || !service || !message) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number' });
    return;
  }
  if (name.length > MAX_LEN.name || phone.length > MAX_LEN.phone ||
      service.length > MAX_LEN.service || message.length > MAX_LEN.message) {
    res.status(400).json({ error: 'Input exceeds maximum allowed length' });
    return;
  }

  const result = db.prepare('INSERT INTO leads (name, phone, service, message) VALUES (?, ?, ?, ?)')
    .run(name, phone, service, message);
  res.status(201).json({ id: result.lastInsertRowid });
});

// GET /api/leads — list all leads (admin only)
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.json(leads);
});

export default router;
