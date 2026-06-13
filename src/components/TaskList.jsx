export default function TaskList({ tasks, onToggle, onDelete, onPostpone }) {
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
            />
          ))}
        </>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, onPostpone }) {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <button
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        title={task.completed ? '取消完成' : '标记完成'}
      >
        {task.completed ? '✔' : ''}
      </button>

      <span className="task-title">{task.title}</span>

      <div className="task-actions">
        {!task.completed && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => onPostpone(task)}
            title="推迟到下一天"
          >
            ⏭ 推迟
          </button>
        )}
        <button
          className="btn btn-sm btn-ghost btn-danger"
          onClick={() => onDelete(task)}
          title="删除任务"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
