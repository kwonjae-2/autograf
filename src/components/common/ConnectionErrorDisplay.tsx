/**
 * Connection Error Display Component
 * 네트워크/CORS 오류용 특화 UI
 */

import type { AppError } from '../../types';
import { getCorsHelpText } from '../../utils/corsDetector';

interface ConnectionErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export function ConnectionErrorDisplay({ error, onRetry }: ConnectionErrorDisplayProps) {
  const isCors = error.type === 'cors';
  const corsHelp = getCorsHelpText();

  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-red-800">
            {isCors ? 'CORS 오류' : '연결 오류'}
          </h3>
          <p className="mt-2 text-sm text-red-700">{error.message}</p>
          
          {error.details && (
            <p className="mt-1 text-xs text-red-600">{error.details}</p>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-800">해결 방법</h4>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              {isCors ? (
                corsHelp.map((help, index) => (
                  <li key={index}>{help}</li>
                ))
              ) : (
                <>
                  <li>Prometheus 서버 URL이 올바른지 확인하세요.</li>
                  <li>네트워크 연결 상태를 확인하세요.</li>
                  <li>Prometheus 서버가 실행 중인지 확인하세요.</li>
                  {error.suggestion && <li>{error.suggestion}</li>}
                </>
              )}
            </ul>
          </div>

          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                다시 시도
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
