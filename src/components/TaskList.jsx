import { useState, useRef, useEffect } from 'react';

export default function TaskList({ tasks, onToggle, onDelete, onPostpone, onEdit }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>✨ 今天还没有任务</p>
        <p className="hint">在上方输入框添加你的第一个任务吧</p>
      </div>
    );
  }

  const incomplete = tasks.filter((t) => !t.completed);
  const complete = tasks.filter((t) => t.completed);

  return (
    <div className="task-list">
      {incomplete.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onPostpone={onPostpone}
          onEdit={onEdit}
        />
      ))}

      {complete.length > 0 && (
        <>
          <div className="section-divider">
            <span>已完成 ({complete.length})</span>
          </div>
          {complete.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              onPostpone={onPostpone}
              onEdit={onEdit}
            />
          ))}
        </>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onPostpone, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task, trimmed);
    } else {
      setDraft(task.title);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(task.title);
    setEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        title={task.completed ? '取消完成' : '标记完成'}
      >
        {task.completed ? '✔' : ''}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          className="task-edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') cancel();
          }}
        />
      ) : (
        <span className="task-title" onClick={() => setEditing(true)} title="点击编辑">
          {task.title}
        </span>
      )}

      <div className="task-actions">
        {!task.completed && !editing && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onPostpone(task)}
            title="推迟到下一天"
          >
            ⏭ 推迟
          </button>
        )}
        {!editing && (
          <button
            className="btn btn-sm btn-ghost btn-danger"
            onClick={() => onDelete(task)}
            title="删除任务"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
