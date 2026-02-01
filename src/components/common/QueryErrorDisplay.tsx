/**
 * Query Error Display Component
 * PromQL 구문 오류용 특화 UI
 */

import type { AppError } from '../../types';

interface QueryErrorDisplayProps {
  error: AppError;
}

export function QueryErrorDisplay({ error }: QueryErrorDisplayProps) {
  return (
    <div className="rounded-lg bg-orange-50 border border-orange-200 p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-medium text-orange-800">쿼리 오류</h3>
          <p className="mt-2 text-sm text-orange-700">{error.message}</p>
          
          {error.details && (
            <div className="mt-3 p-3 bg-orange-100 rounded-md">
              <code className="text-xs text-orange-900 font-mono whitespace-pre-wrap">
                {error.details}
              </code>
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-sm font-medium text-orange-800">확인 사항</h4>
            <ul className="mt-2 text-sm text-orange-700 list-disc list-inside space-y-1">
              <li>PromQL 문법이 올바른지 확인하세요.</li>
              <li>메트릭 이름이 존재하는지 확인하세요.</li>
              <li>레이블 셀렉터 형식이 올바른지 확인하세요.</li>
              <li>함수 사용법이 올바른지 확인하세요.</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-orange-100 rounded-md">
            <h4 className="text-xs font-medium text-orange-800 mb-1">PromQL 예시</h4>
            <ul className="text-xs text-orange-700 space-y-0.5 font-mono">
              <li>up</li>
              <li>rate(http_requests_total[5m])</li>
              <li>sum by (job) (process_cpu_seconds_total)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
