import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data.json');

// ── JSON file store ──────────────────────────────────────────────────────
// Schema: { tasks: [{ id, title, date, completed, created_at }], nextId: N }

function readDB() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { tasks: [], nextId: 1 };
  }
}

function writeDB(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

// ── Public API ───────────────────────────────────────────────────────────

export function getTasksByDate(date) {
  const db = readDB();
  return db.tasks
    .filter((t) => t.date === date)
    .sort((a, b) => a.completed - b.completed || b.id - a.id);
}

export function getTaskById(id) {
  const db = readDB();
  return db.tasks.find((t) => t.id === id) || null;
}

export function createTask(title, date) {
  const db = readDB();
  const task = {
    id: db.nextId++,
    title,
    date,
    completed: 0,
    created_at: new Date().toISOString(),
  };
  db.tasks.push(task);
  writeDB(db);
  return task;
}

export function updateTask(id, fields) {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return null;
  if (fields.title !== undefined) task.title = fields.title;
  if (fields.date !== undefined) task.date = fields.date;
  if (fields.completed !== undefined) task.completed = fields.completed;
  writeDB(db);
  return { ...task };
}

export function deleteTask(id) {
  const db = readDB();
  const idx = db.tasks.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  db.tasks.splice(idx, 1);
  writeDB(db);
  return true;
}

function addDays(dateStr, n) {
  // Timezone-safe date arithmetic: parse manually, avoid UTC pitfalls
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export function postponeTask(id) {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === id);
  if (!task) return null;
  task.date = addDays(task.date, 1);
  writeDB(db);
  return { ...task };
}

export function copyTasksToDates(taskIds, targetDates) {
  const db = readDB();
  let count = 0;
  for (const tid of taskIds) {
    const src = db.tasks.find((t) => t.id === tid);
    if (!src) continue;
    for (const date of targetDates) {
      db.tasks.push({
        id: db.nextId++,
        title: src.title,
        date,
        completed: 0,
        created_at: new Date().toISOString(),
      });
      count++;
    }
  }
  writeDB(db);
  return count;
}
