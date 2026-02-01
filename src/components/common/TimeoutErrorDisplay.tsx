/**
 * Timeout Error Display
 */

import type { AppError } from '../../types';

interface TimeoutErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export function TimeoutErrorDisplay({ error, onRetry }: TimeoutErrorDisplayProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-400">Request Timeout</p>
          <p className="mt-1 text-sm text-slate-400">{error.message}</p>
          <p className="mt-2 text-xs text-slate-500">
            Try reducing time range or increasing step
          </p>
          {onRetry && (
            <button onClick={onRetry} className="mt-3 btn-secondary text-sm">
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
