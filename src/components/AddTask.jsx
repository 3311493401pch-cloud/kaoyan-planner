import { useState } from 'react';

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setAdding(true);
    await onAdd(trimmed);
    setTitle('');
    setAdding(false);
  };

  return (
    <form className="add-task" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-task-input"
        placeholder="添加新任务，例如：背考研英语单词 Unit 5…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={adding}
        autoFocus
      />
      <button type="submit" className="btn btn-primary" disabled={adding || !title.trim()}>
        {adding ? '添加中…' : '＋ 添加'}
      </button>
    </form>
  );
}
