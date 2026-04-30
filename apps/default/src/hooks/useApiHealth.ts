import { useState, useEffect, useCallback } from 'react';

export type ApiStatus = 'checking' | 'online' | 'offline';

const HEALTH_URLS = [
  '/api/taskade/projects/JGUD6icgVKi5MbHW/nodes',
  '/api/taskade/projects/FdxmcLMZ5RDz7mBf/nodes',
];
const RETRY_INTERVAL_MS = 30_000;
const TIMEOUT_MS = 8_000;
// Number of consecutive failures required before showing the offline banner
const FAILURE_THRESHOLD = 3;

export function useApiHealth() {
  const [status, setStatus] = useState<ApiStatus>('online');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [failureCount, setFailureCount] = useState(0);

  const check = useCallback(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let anyOk = false;
    try {
      for (const url of HEALTH_URLS) {
        try {
          const res = await fetch(url, { method: 'GET', signal: controller.signal });
          if (res.ok) { anyOk = true; break; }
        } catch {
          // try next
        }
      }
    } finally {
      clearTimeout(timer);
      setLastChecked(new Date());
    }

    if (anyOk) {
      setFailureCount(0);
      setStatus('online');
    } else {
      setFailureCount((prev) => {
        const next = prev + 1;
        if (next >= FAILURE_THRESHOLD) setStatus('offline');
        return next;
      });
    }
  }, []);

  useEffect(() => {
    // Don't block the app on first load — check quietly in the background
    const initialDelay = setTimeout(check, 2000);
    const interval = setInterval(check, RETRY_INTERVAL_MS);
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [check]);

  return { status, lastChecked, retry: check };
}
