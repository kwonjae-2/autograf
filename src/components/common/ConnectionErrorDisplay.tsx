/**
 * Connection Error Display
 */

import type { AppError } from '../../types';

interface ConnectionErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export function ConnectionErrorDisplay({ error, onRetry }: ConnectionErrorDisplayProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-400">Connection Failed</p>
          <p className="mt-1 text-sm text-slate-400">{error.message}</p>
          {error.type === 'cors' && (
            <p className="mt-2 text-xs text-slate-500">
              Check CORS settings on your Prometheus server
            </p>
          )}
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
