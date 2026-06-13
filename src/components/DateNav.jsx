import { todayStr, addDays, formatDate } from '../dateUtils';

export default function DateNav({ selectedDate, onChange }) {
  const isToday = selectedDate === todayStr();

  return (
    <div className="date-nav">
      <button className="btn btn-icon" onClick={() => onChange(addDays(selectedDate, -1))} title="前一天">
        ◀
      </button>

      <div className="date-center">
        {!isToday && (
          <button className="btn btn-today" onClick={() => onChange(todayStr())}>
            今天
          </button>
        )}
        <label className="date-label">
          <span className="date-text">{formatDate(selectedDate)}</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onChange(e.target.value)}
            className="date-picker-hidden"
          />
        </label>
      </div>

      <button className="btn btn-icon" onClick={() => onChange(addDays(selectedDate, 1))} title="后一天">
        ▶
      </button>
    </div>
  );
}
