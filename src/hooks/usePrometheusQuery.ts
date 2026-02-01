/**
 * usePrometheusQuery Hook
 * Prometheus 쿼리 실행 및 상태 관리
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { QueryResult, AppError as AppErrorType } from '../types';
import { queryRange } from '../services/prometheus/client';
import { AppError } from '../utils/errors';

interface QueryOptions {
  url: string;
  query: string;
  start?: number;
  end?: number;
  step?: string;
}

interface UsePrometheusQueryResult {
  data: QueryResult | null;
  error: AppErrorType | null;
  isLoading: boolean;
  execute: (options: QueryOptions) => void;
  reset: () => void;
}

/**
 * Hook for executing Prometheus queries
 */
export function usePrometheusQuery(): UsePrometheusQueryResult {
  const [data, setData] = useState<QueryResult | null>(null);
  const [error, setError] = useState<AppErrorType | null>(null);

  const mutation = useMutation({
    mutationFn: async (options: QueryOptions) => {
      const now = Math.floor(Date.now() / 1000);
      const start = options.start ?? now - 3600; // Default: 1 hour ago
      const end = options.end ?? now;
      const step = options.step ?? '15s';

      return queryRange(
        { baseUrl: options.url },
        options.query,
        start,
        end,
        step
      );
    },
    onSuccess: (result) => {
      setData(result);
      setError(null);
    },
    onError: (err) => {
      setData(null);
      if (err instanceof AppError) {
        setError(err.toJSON());
      } else {
        setError(AppError.fromError(err).toJSON());
      }
    },
  });

  const execute = useCallback(
    (options: QueryOptions) => {
      mutation.mutate(options);
    },
    [mutation]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    mutation.reset();
  }, [mutation]);

  return {
    data,
    error,
    isLoading: mutation.isPending,
    execute,
    reset,
  };
}
