import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, postponeTask, copyTasks } from './api';
import DateNav from './components/DateNav';
import TaskList from './components/TaskList';
import AddTask from './components/AddTask';
import CopyModal from './components/CopyModal';
import Countdown from './components/Countdown';

import { todayStr } from './dateUtils';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyModalOpen, setCopyModalOpen] = useState(false);

  const loadTasks = useCallback(async (date) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(date);
      setTasks(data);
    } catch (e) {
      setError('加载任务失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks(selectedDate);
  }, [selectedDate, loadTasks]);

  const handleAddTask = async (title) => {
    try {
      await createTask(title, selectedDate);
      await loadTasks(selectedDate);
    } catch (e) {
      setError('添加任务失败: ' + e.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: task.completed ? 0 : 1 });
      await loadTasks(selectedDate);
    } catch (e) {
      setError('更新任务失败: ' + e.message);
    }
  };

  const handleDelete = async (task) => {
    if (!confirm(`确定删除「${task.title}」？`)) return;
    try {
      await deleteTask(task.id);
      await loadTasks(selectedDate);
    } catch (e) {
      setError('删除任务失败: ' + e.message);
    }
  };

  const handlePostpone = async (task) => {
    try {
      await postponeTask(task.id);
      await loadTasks(selectedDate);
    } catch (e) {
      setError('推迟任务失败: ' + e.message);
    }
  };

  const handleCopy = async (taskIds, targetDates) => {
    try {
      await copyTasks(taskIds, targetDates);
      setCopyModalOpen(false);
      await loadTasks(selectedDate);
    } catch (e) {
      setError('复制任务失败: ' + e.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 考研每日计划</h1>
        <p className="subtitle">坚持每一天，上岸不远</p>
      </header>

      <Countdown />

      <DateNav selectedDate={selectedDate} onChange={setSelectedDate} />

      {error && <div className="error-banner">{error}</div>}

      <AddTask onAdd={handleAddTask} />

      <div className="toolbar">
        <span className="task-count">
          {tasks.length === 0
            ? '今天还没有任务'
            : `${tasks.filter((t) => t.completed).length}/${tasks.length} 已完成`}
        </span>
        {tasks.length > 0 && (
          <button className="btn btn-outline" onClick={() => setCopyModalOpen(true)}>
            📋 复制任务
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onPostpone={handlePostpone}
        />
      )}

      {copyModalOpen && (
        <CopyModal
          tasks={tasks}
          selectedDate={selectedDate}
          onCopy={handleCopy}
          onClose={() => setCopyModalOpen(false)}
        />
      )}
    </div>
  );
}
