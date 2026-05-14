import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import leadsRouter from './routes/leads';
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
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173', 'https://larsha-tech.github.io'];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : defaultOrigins;

app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '16kb' }));

app.use('/api/leads', leadsRouter);

// Admin dashboard — HTTP Basic Auth
app.get('/admin', (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Tech Admin"');
    res.status(401).send('Login required');
    return;
  }
  const [, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  if (pass !== adminPassword) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Tech Admin"');
    res.status(401).send('Invalid credentials');
    return;
  }
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  res.send(adminHtml(leads as Parameters<typeof adminHtml>[0]));
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
  console.log(`Larsha Tech API → http://localhost:${PORT}`);
});
