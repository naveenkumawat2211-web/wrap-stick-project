import { useState, useEffect, useCallback } from 'react';
import { ORDER_CANCEL_WINDOW_MS } from '../constants/orderConfig';

export function useOrderCountdown(windowMs = ORDER_CANCEL_WINDOW_MS) {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingMs = useCallback(
    (createdAt) => {
      const created = Number(createdAt || 0);
      if (!created) return 0;
      return Math.max(0, windowMs - (nowMs - created));
    },
    [nowMs, windowMs]
  );

  const formatCountdown = useCallback((ms) => {
    const totalSec = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, []);

  return { nowMs, getRemainingMs, formatCountdown };
}
