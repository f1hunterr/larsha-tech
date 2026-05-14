import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { mkdirSync } from 'fs';

const dbPath = process.env.DB_PATH || join(process.cwd(), 'leads.db');
mkdirSync(dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    phone     TEXT NOT NULL,
    service   TEXT NOT NULL,
    message   TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    device_type    TEXT NOT NULL,
    brand          TEXT NOT NULL,
    model          TEXT,
    device_age     TEXT,
    issue          TEXT NOT NULL,
    description    TEXT NOT NULL,
    urgency        TEXT NOT NULL,
    service_mode   TEXT NOT NULL,
    address        TEXT,
    preferred_date TEXT,
    preferred_slot TEXT,
    name           TEXT NOT NULL,
    phone          TEXT NOT NULL,
    email          TEXT,
    status         TEXT NOT NULL DEFAULT 'new',
    created_at     TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

export default db;
