'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshOptions {
  intervalMs?: number;
  enabled?: boolean;
  onRefresh?: () => void;
}

export function useAutoRefresh(options: UseAutoRefreshOptions = {}) {
  const { intervalMs = 15000, enabled = true, onRefresh } = options;
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      onRefresh?.();
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      refresh();
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, intervalMs, refresh]);

  return { lastRefresh, isRefreshing, refresh };
}

export function useFetch<T>(
  url: string | null,
  options?: { refreshInterval?: number; fallback?: T }
) {
  const [data, setData] = useState<T | null>(options?.fallback ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!options?.refreshInterval || !url) return;
    const id = setInterval(fetchData, options.refreshInterval);
    return () => clearInterval(id);
  }, [fetchData, options?.refreshInterval, url]);

  return { data, loading, error, refetch: fetchData, lastFetch };
}
