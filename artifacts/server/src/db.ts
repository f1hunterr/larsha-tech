import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = process.env.DB_PATH || join(process.cwd(), 'leads.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL,
    phone     TEXT NOT NULL,
    service   TEXT NOT NULL,
    message   TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
  )
`);

export default db;
