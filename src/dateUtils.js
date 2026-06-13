/**
 * Timezone-safe local-date helpers.
 *
 * The problem: `new Date('2025-06-13T00:00:00')` creates a local-midnight
 * timestamp, BUT `.toISOString()` returns UTC — so in UTC+8 the string
 * shifts back one day.  This module does all arithmetic on the Y-M-D parts
 * directly so the date string never drifts.
 */

/** Return today's date as YYYY-MM-DD in the LOCAL timezone. */
export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Add N days to a YYYY-MM-DD string (N can be negative). */
export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

/** Format a YYYY-MM-DD string for display, e.g. "6月13日 星期五". */
export function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${m}月${d}日 星期${weekdays[dt.getDay()]}`;
}
