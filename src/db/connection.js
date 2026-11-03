import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.resolve(__dirname, '../../data/app.db');

// Make sure the data directory exists before SQLite tries to open the file.
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL CHECK (role IN ('doctor','staff','administrator')),
      department    TEXT,
      created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
    );

    CREATE TABLE IF NOT EXISTS patients (
      id                      TEXT PRIMARY KEY,
      patient_code            TEXT NOT NULL UNIQUE,
      name                    TEXT NOT NULL,
      age                     INTEGER NOT NULL,
      gender                  TEXT NOT NULL CHECK (gender IN ('Male','Female','Other')),
      phone                   TEXT NOT NULL,
      address                 TEXT NOT NULL,
      emergency_contact       TEXT NOT NULL,
      emergency_contact_phone TEXT,
      blood_group             TEXT,
      created_by              TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at              TEXT NOT NULL,
      updated_at              TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cases (
      id                 TEXT PRIMARY KEY,
      patient_id         TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      chief_complaint    TEXT NOT NULL,
      present_illness    TEXT,
      past_history       TEXT,
      allergies          TEXT,
      medications        TEXT,
      examination_notes  TEXT,
      vitals_json        TEXT,
      additional_notes   TEXT,
      recorded_by_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
      recorded_by_name   TEXT NOT NULL,
      recorded_by_role   TEXT NOT NULL,
      created_at         TEXT NOT NULL,
      updated_at         TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cases_patient_id ON cases(patient_id);
    CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
  `);
}

initSchema();
