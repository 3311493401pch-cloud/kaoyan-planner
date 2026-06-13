import { useState } from 'react';
import { addDays } from '../dateUtils';

export default function CopyModal({ tasks, selectedDate, onCopy, onClose }) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [targetDates, setTargetDates] = useState([]);
  const [dateInput, setDateInput] = useState('');
  const [copying, setCopying] = useState(false);

  // Only show incomplete tasks (completed ones are less likely to be copied)
  const copyableTasks = tasks.filter((t) => !t.completed);

  const toggleTask = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === copyableTasks.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(copyableTasks.map((t) => t.id)));
    }
  };

  const addDate = () => {
    const d = dateInput.trim();
    if (!d || targetDates.includes(d)) return;
    setTargetDates([...targetDates, d].sort());
    setDateInput('');
  };

  const removeDate = (d) => {
    setTargetDates(targetDates.filter((x) => x !== d));
  };

  const handleCopy = async () => {
    if (selectedIds.size === 0 || targetDates.length === 0) return;
    setCopying(true);
    await onCopy([...selectedIds], targetDates);
    setCopying(false);
  };

  // Quick-date presets: next 7 days
  const quickDates = [];
  for (let i = 1; i <= 7; i++) {
    quickDates.push(addDays(selectedDate, i));
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 复制任务到其他日期</h2>
          <button className="btn btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Select tasks */}
          <div className="modal-section">
            <div className="section-header">
              <span>选择要复制的任务</span>
              <button className="btn btn-link" onClick={toggleAll}>
                {selectedIds.size === copyableTasks.length ? '取消全选' : '全选'}
              </button>
            </div>
            {copyableTasks.length === 0 ? (
              <p className="hint">没有可复制的未完成任务</p>
            ) : (
              <div className="copy-task-list">
                {copyableTasks.map((t) => (
                  <label key={t.id} className="copy-task-item">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(t.id)}
                      onChange={() => toggleTask(t.id)}
                    />
                    <span>{t.title}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Select target dates */}
          <div className="modal-section">
            <div className="section-header">
              <span>选择目标日期</span>
            </div>

            {/* Quick date chips */}
            <div className="date-chips">
              {quickDates.map((d) => (
                <button
                  key={d}
                  className={`chip ${targetDates.includes(d) ? 'active' : ''}`}
                  onClick={() => {
                    if (targetDates.includes(d)) removeDate(d);
                    else setTargetDates([...targetDates, d].sort());
                  }}
                >
                  {d.slice(5)}
                </button>
              ))}
            </div>

            {/* Custom date input */}
            <div className="custom-date-row">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="date-input"
              />
              <button className="btn btn-sm btn-outline" onClick={addDate} disabled={!dateInput}>
                添加
              </button>
            </div>

            {/* Selected dates */}
            {targetDates.length > 0 && (
              <div className="selected-dates">
                {targetDates.map((d) => (
                  <span key={d} className="chip active">
                    {d} <button onClick={() => removeDate(d)}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>取消</button>
          <button
            className="btn btn-primary"
            disabled={selectedIds.size === 0 || targetDates.length === 0 || copying}
            onClick={handleCopy}
          >
            {copying
              ? '复制中…'
              : `复制 ${selectedIds.size} 个任务到 ${targetDates.length} 个日期`}
          </button>
        </div>
      </div>
    </div>
  );
}
