import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ── API Routes ────────────────────────────────────────────────────────────

// GET /api/tasks?date=YYYY-MM-DD  — list tasks for a date
app.get('/api/tasks', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
  }
  const tasks = db.getTasksByDate(date);
  res.json(tasks);
});

// POST /api/tasks  — create a task  { title, date }
app.post('/api/tasks', (req, res) => {
  const { title, date } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!date) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }
  const task = db.createTask(title.trim(), date);
  res.status(201).json(task);
});

// PUT /api/tasks/:id  — update a task  { title?, date?, completed? }
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = db.updateTask(id, req.body);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json(task);
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = db.deleteTask(id);
  if (!deleted) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json({ deleted: true });
});

// POST /api/tasks/:id/postpone  — move a task to the next day
app.post('/api/tasks/:id/postpone', (req, res) => {
  const id = Number(req.params.id);
  const task = db.postponeTask(id);
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.json(task);
});

// POST /api/tasks/copy  — copy selected tasks to target dates
// body: { taskIds: [1,2,3], targetDates: ['2025-01-05', '2025-01-06'] }
app.post('/api/tasks/copy', (req, res) => {
  const { taskIds, targetDates } = req.body;
  if (!taskIds || !taskIds.length) {
    return res.status(400).json({ error: 'taskIds array is required' });
  }
  if (!targetDates || !targetDates.length) {
    return res.status(400).json({ error: 'targetDates array is required' });
  }

  const count = db.copyTasksToDates(taskIds, targetDates);
  res.status(201).json({ copied: count });
});

// ── Serve static frontend in production ───────────────────────────────────
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
