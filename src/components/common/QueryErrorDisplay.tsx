/**
 * Query Error Display
 */

import type { AppError } from '../../types';

interface QueryErrorDisplayProps {
  error: AppError;
}

export function QueryErrorDisplay({ error }: QueryErrorDisplayProps) {
  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-400">Query Error</p>
          <p className="mt-1 text-sm text-slate-400">{error.message}</p>
          {error.details && (
            <pre className="mt-2 p-2 rounded bg-slate-800/50 text-xs font-mono text-slate-500 overflow-x-auto">
              {error.details}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
