import { useEffect, useRef } from 'react';

export type RefreshInterval = 0 | 5 | 10 | 30;

export const REFRESH_OPTIONS: { label: string; value: RefreshInterval }[] = [
  { label: 'Off', value: 0 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
];

export function useAutoRefresh(enabled: boolean, intervalSecs: RefreshInterval, onTick: () => void) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!enabled || intervalSecs === 0) return;
    const id = setInterval(() => onTickRef.current(), intervalSecs * 1000);
    return () => clearInterval(id);
  }, [enabled, intervalSecs]);
}
