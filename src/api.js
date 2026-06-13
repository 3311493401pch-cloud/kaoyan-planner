const API = '/api';

export async function fetchTasks(date) {
  const res = await fetch(`${API}/tasks?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(title, date) {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id, fields) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function postponeTask(id) {
  const res = await fetch(`${API}/tasks/${id}/postpone`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to postpone task');
  return res.json();
}

export async function copyTasks(taskIds, targetDates) {
  const res = await fetch(`${API}/tasks/copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds, targetDates }),
  });
  if (!res.ok) throw new Error('Failed to copy tasks');
  return res.json();
}
