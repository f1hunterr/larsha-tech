import { Router, Request, Response, NextFunction } from 'express';
import db from '../db';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const MAX_LEN = {
  deviceType: 50, brand: 50, model: 80, deviceAge: 30,
  issue: 100, description: 2000, urgency: 20,
  serviceMode: 20, address: 300, preferredDate: 20, preferredSlot: 50,
  name: 100, phone: 20, email: 120,
};

const rateMap = new Map<string, { count: number; resetAt: number }>();
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

function str(body: Record<string, unknown>, key: string): string {
  return typeof body[key] === 'string' ? (body[key] as string).trim() : '';
}

// POST /api/bookings — save a new repair booking
router.post('/', rateLimit, (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>;

  const deviceType    = str(body, 'deviceType');
  const brand         = str(body, 'brand');
  const model         = str(body, 'model');
  const deviceAge     = str(body, 'deviceAge');
  const issue         = str(body, 'issue');
  const description   = str(body, 'description');
  const urgency       = str(body, 'urgency');
  const serviceMode   = str(body, 'serviceMode');
  const address       = str(body, 'address');
  const preferredDate = str(body, 'preferredDate');
  const preferredSlot = str(body, 'preferredSlot');
  const name          = str(body, 'name');
  const phone         = str(body, 'phone');
  const email         = str(body, 'email');

  if (!deviceType || !brand || !issue || !description || !urgency || !serviceMode || !name || !phone) {
    res.status(400).json({ error: 'Required fields are missing' });
    return;
  }
  if (serviceMode === 'doorstep' && !address) {
    res.status(400).json({ error: 'Address is required for doorstep service' });
    return;
  }
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
    res.status(400).json({ error: 'Invalid Indian mobile number' });
    return;
  }

  const overLimit = (
    deviceType.length    > MAX_LEN.deviceType    ||
    brand.length         > MAX_LEN.brand         ||
    model.length         > MAX_LEN.model         ||
    issue.length         > MAX_LEN.issue         ||
    description.length   > MAX_LEN.description   ||
    name.length          > MAX_LEN.name          ||
    phone.length         > MAX_LEN.phone         ||
    email.length         > MAX_LEN.email         ||
    address.length       > MAX_LEN.address
  );
  if (overLimit) {
    res.status(400).json({ error: 'Input exceeds maximum allowed length' });
    return;
  }

  const result = db.prepare(`
    INSERT INTO bookings
      (device_type, brand, model, device_age, issue, description, urgency,
       service_mode, address, preferred_date, preferred_slot, name, phone, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    deviceType, brand, model, deviceAge, issue, description, urgency,
    serviceMode, address, preferredDate, preferredSlot, name, phone, email,
  );

  res.status(201).json({ id: result.lastInsertRowid });
});

// GET /api/bookings — list all bookings (admin only)
router.get('/', requireAdmin, (_req: Request, res: Response) => {
  const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
  res.json(bookings);
});

// PATCH /api/bookings/:id/status — update booking status (admin only)
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const status = typeof req.body?.status === 'string' ? (req.body.status as string).trim() : '';
  const allowed = ['new', 'confirmed', 'in-progress', 'done', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: 'Invalid status value' });
    return;
  }
  const info = db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
  if (info.changes === 0) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json({ ok: true });
});

export default router;
