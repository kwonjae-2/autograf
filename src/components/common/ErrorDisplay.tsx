/**
 * ErrorDisplay Component
 */

import type { AppError } from '../../types';
import { getErrorConfig } from '../../utils/errorMessages';

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const config = getErrorConfig(error.type);

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">{config.title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
            {error.details && (
              <p className="mt-1 text-xs text-red-600">{error.details}</p>
            )}
          </div>
          {error.suggestion && (
            <div className="mt-3">
              <p className="text-sm text-red-700">
                <span className="font-medium">해결 방법:</span> {error.suggestion}
              </p>
            </div>
          )}
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                다시 시도
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
