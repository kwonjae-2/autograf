/**
 * Visualization Panel Container
 */

import type { QueryResult } from '../../types';
import { isSuccessResult, isErrorResult } from '../../types';
import { getVisualizationRecommendation } from '../../services/analyzer/visualizationSelector';
import { createChartSpec } from '../../services/analyzer/chartSpecFactory';
import { countSeries, countDataPoints, isLargeDataset } from '../../services/analyzer/seriesAnalyzer';
import { Chart } from './Chart';
import { StatDisplay } from './StatDisplay';
import { DataTable } from './DataTable';
import { RawDataViewer } from './RawDataViewer';
import { ErrorDisplay } from '../common';
import { AppError } from '../../utils/errors';

interface VisualizationPanelProps {
  result: QueryResult;
}

export function VisualizationPanel({ result }: VisualizationPanelProps) {
  // Handle error result
  if (isErrorResult(result)) {
    const error = new AppError(
      'query',
      result.error,
      `Error type: ${result.errorType}`,
      'PromQL 문법을 확인하거나 다른 쿼리를 시도해보세요.'
    );
    return <ErrorDisplay error={error.toJSON()} />;
  }

  if (!isSuccessResult(result)) {
    return (
      <div className="text-center py-8 text-gray-500">
        알 수 없는 응답 형식입니다.
      </div>
    );
  }

  const data = result.data;
  const seriesCount = countSeries(data);
  const dataPoints = countDataPoints(data);
  const isLarge = isLargeDataset(data);

  // Empty result check
  if (seriesCount === 0) {
    return (
      <div className="space-y-4">
        <div className="card p-6 text-center">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">결과 없음</h3>
          <p className="mt-1 text-sm text-gray-500">
            쿼리가 성공했지만 결과 데이터가 없습니다.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            메트릭 이름, 레이블, 시간 범위를 확인해보세요.
          </p>
        </div>
        <RawDataViewer data={result} />
      </div>
    );
  }

  const { type, reason } = getVisualizationRecommendation(data);
  const chartConfig = createChartSpec(type, data);

  return (
    <div className="space-y-4">
      {/* Large dataset warning */}
      {isLarge && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">대량 데이터 경고</h3>
              <p className="mt-1 text-sm text-yellow-700">
                {dataPoints.toLocaleString()}개의 데이터 포인트가 있습니다. 
                성능을 위해 step 값을 늘리는 것을 권장합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visualization */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">시각화</h3>
              <p className="text-xs text-gray-500 mt-1">{reason}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <div>{seriesCount}개 시리즈</div>
              <div>{dataPoints.toLocaleString()}개 데이터 포인트</div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          {(type === 'line' || type === 'area' || type === 'bar') && (
            <Chart config={chartConfig} height={400} />
          )}
          {type === 'stat' && <StatDisplay config={chartConfig} />}
          {type === 'table' && <DataTable config={chartConfig} />}
          {type === 'text' && (
            <div className="text-center py-8">
              <p className="text-lg font-mono text-gray-900">{chartConfig.value}</p>
            </div>
          )}
        </div>
      </div>

      {/* Raw Data */}
      <RawDataViewer data={result} />
    </div>
  );
}
