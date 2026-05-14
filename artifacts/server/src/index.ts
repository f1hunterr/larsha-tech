import express, { Request, Response } from 'express';
import cors from 'cors';
import db from './db';
import leadsRouter from './routes/leads';
import { adminHtml } from './admin';

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

app.use(cors());
app.use(express.json());

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
  if (pass !== ADMIN_PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Larsha Tech Admin"');
    res.status(401).send('Invalid credentials');
    return;
  }
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all() as any[];
  res.send(adminHtml(leads));
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Larsha Tech API → http://localhost:${PORT}`);
});
