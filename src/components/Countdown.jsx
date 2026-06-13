import { useState, useEffect } from 'react';

const EXAM_DATE = new Date(2026, 11, 20); // Dec 20, 2026 (month is 0-indexed)

function calcRemaining() {
  const now = new Date();
  const diff = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function Countdown() {
  const [days, setDays] = useState(calcRemaining());

  useEffect(() => {
    const timer = setInterval(() => setDays(calcRemaining()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (days === 0) {
    return <div className="countdown">🎉 考研加油，今天就是决战的时刻！</div>;
  }

  return (
    <div className="countdown">
      距离 <strong>2027 考研</strong> 还有 <span className="countdown-num">{days}</span> 天
    </div>
  );
}
