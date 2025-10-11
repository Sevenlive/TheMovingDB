import { Database } from 'bun:sqlite';
import { join } from 'path';

const db = new Database(join(import.meta.dir, 'moving.db'));

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS boxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    number INTEGER NOT NULL UNIQUE,
    room TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT 'old_home',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    condition TEXT,
    box_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (box_id) REFERENCES boxes (id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_items_box_id ON items(box_id);
  CREATE INDEX IF NOT EXISTS idx_boxes_location ON boxes(location);
  CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
`);

export default db;
