/**
 * Empty Result Display Component
 * 결과가 없을 때 표시
 */

interface EmptyResultDisplayProps {
  query?: string;
}

export function EmptyResultDisplay({ query }: EmptyResultDisplayProps) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 p-6">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">결과 없음</h3>
        <p className="mt-1 text-sm text-gray-500">
          쿼리가 성공했지만 결과 데이터가 없습니다.
        </p>

        {query && (
          <div className="mt-3 p-2 bg-gray-100 rounded-md">
            <code className="text-xs text-gray-700 font-mono">{query}</code>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">확인 사항</h4>
          <ul className="mt-2 text-sm text-gray-600 text-left list-disc list-inside space-y-1 max-w-md mx-auto">
            <li>메트릭 이름이 정확한지 확인하세요.</li>
            <li>레이블 셀렉터가 올바른지 확인하세요.</li>
            <li>선택한 시간 범위에 데이터가 존재하는지 확인하세요.</li>
            <li>Prometheus 서버에 해당 메트릭이 수집되고 있는지 확인하세요.</li>
          </ul>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Prometheus UI에서 직접 쿼리를 테스트해보세요.
        </div>
      </div>
    </div>
  );
}
