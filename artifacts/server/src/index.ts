import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import leadsRouter from './routes/leads';
import bookingsRouter from './routes/bookings';
import applicationsRouter from './routes/applications';
import diagnosesRouter from './routes/diagnoses';
import { adminHtml } from './admin';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Fail fast in production if admin password is not set
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  if (process.env.NODE_ENV === 'production') {
    console.error('FATAL: ADMIN_PASSWORD environment variable is not set');
    process.exit(1);
  }
  console.warn('WARNING: ADMIN_PASSWORD not set — using insecure default for development');
}
const adminPassword = ADMIN_PASSWORD || 'dev-only-changeme';

// Restrict CORS to known origins (set ALLOWED_ORIGINS in production)
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : defaultOrigins;

app.set('trust proxy', 1);
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'PATCH'] }));
app.use(express.json({ limit: '16kb' }));

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

app.use('/api/leads', leadsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/diagnoses', diagnosesRouter);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

// Simple rate limiter for admin endpoint
const adminRateMap = new Map<string, { count: number; resetAt: number }>();
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of adminRateMap.entries()) {
    if (entry.resetAt < now) adminRateMap.delete(ip);
  }
}, 60_000);

function adminRateLimit(req: Request, res: Response, next: () => void) {
  const ip = req.ip ?? 'unknown';
  const now = Date.now();
  const WINDOW = 15 * 60 * 1000;
  const LIMIT = 10;
  const entry = adminRateMap.get(ip);
  if (!entry || entry.resetAt < now) {
    adminRateMap.set(ip, { count: 1, resetAt: now + WINDOW });
    next(); return;
  }
  if (entry.count >= LIMIT) {
    res.status(429).send('Too many login attempts. Try again later.');
    return;
  }
  entry.count++;
  next();
}

// Admin dashboard — HTTP Basic Auth
app.get('/admin', adminRateLimit, (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Technologies Admin"');
    res.status(401).send('Login required');
    return;
  }
  const decoded = Buffer.from(header.slice(6), 'base64').toString();
  const colonIdx = decoded.indexOf(':');
  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);
  if (user !== ADMIN_USERNAME || pass !== adminPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Technologies Admin"');
    res.status(401).send('Invalid credentials');
    return;
  }
  const leads        = db.prepare('SELECT * FROM leads        ORDER BY created_at DESC').all();
  const bookings     = db.prepare('SELECT * FROM bookings     ORDER BY created_at DESC').all();
  const applications = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();
  const diagnoses    = db.prepare('SELECT * FROM diagnoses    ORDER BY created_at DESC').all();
  res.send(adminHtml(
    leads        as Parameters<typeof adminHtml>[0],
    bookings     as Parameters<typeof adminHtml>[1],
    applications as Parameters<typeof adminHtml>[2],
    diagnoses    as Parameters<typeof adminHtml>[3],
  ));
});

app.get('/health', (_req, res) => res.json({ ok: true }));

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`Larsha Technologies API → http://localhost:${PORT}`);
});
