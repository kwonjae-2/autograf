/**
 * Timeout Error Display Component
 * 타임아웃 오류용 특화 UI (재시도 옵션 포함)
 */

import type { AppError } from '../../types';

interface TimeoutErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export function TimeoutErrorDisplay({ error, onRetry }: TimeoutErrorDisplayProps) {
  return (
    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-yellow-800">요청 시간 초과</h3>
          <p className="mt-2 text-sm text-yellow-700">{error.message}</p>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-yellow-800">해결 방법</h4>
            <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
              <li>
                <strong>시간 범위를 줄이세요.</strong> 더 짧은 기간의 데이터를 조회하세요.
              </li>
              <li>
                <strong>Step을 늘리세요.</strong> 더 큰 step 값은 더 적은 데이터 포인트를 반환합니다.
              </li>
              <li>
                <strong>쿼리를 단순화하세요.</strong> 복잡한 집계 함수나 조인을 줄여보세요.
              </li>
              <li>
                <strong>네트워크 상태를 확인하세요.</strong> 일시적인 네트워크 문제일 수 있습니다.
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                다시 시도
              </button>
            )}
            <span className="text-xs text-yellow-600">
              일시적인 문제일 수 있습니다. 다시 시도해보세요.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
