/**
 * Visualization Panel
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

interface VisualizationPanelProps {
  result: QueryResult;
}

export function VisualizationPanel({ result }: VisualizationPanelProps) {
  if (isErrorResult(result)) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-400 mb-2">Query Error</div>
        <p className="text-sm text-slate-400">{result.error}</p>
      </div>
    );
  }

  if (!isSuccessResult(result)) {
    return (
      <div className="card p-6 text-center text-slate-500">
        Unknown response format
      </div>
    );
  }

  const data = result.data;
  const seriesCount = countSeries(data);
  const dataPoints = countDataPoints(data);
  const isLarge = isLargeDataset(data);

  if (seriesCount === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-400">No data returned</p>
        <p className="text-sm text-slate-600 mt-1">Check your query and time range</p>
      </div>
    );
  }

  const { type } = getVisualizationRecommendation(data);
  const chartConfig = createChartSpec(type, data);

  return (
    <div className="space-y-4">
      {/* Large dataset warning */}
      {isLarge && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-amber-200">Large dataset ({dataPoints.toLocaleString()} points). Consider increasing step.</span>
        </div>
      )}

      {/* Chart */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-200">{getChartTitle(type)}</span>
            <span className="text-xs text-slate-500">{seriesCount} series · {dataPoints.toLocaleString()} points</span>
          </div>
        </div>
        <div className="p-4">
          {(type === 'line' || type === 'area' || type === 'bar') && (
            <Chart config={chartConfig} height={400} />
          )}
          {type === 'stat' && <StatDisplay config={chartConfig} />}
          {type === 'table' && <DataTable config={chartConfig} />}
          {type === 'text' && (
            <div className="py-8 text-center">
              <span className="text-2xl font-mono text-slate-200">{chartConfig.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Raw Data */}
      <RawDataViewer data={result} />
    </div>
  );
}

function getChartTitle(type: string): string {
  switch (type) {
    case 'line': return 'Time Series';
    case 'area': return 'Stacked Area';
    case 'bar': return 'Bar Chart';
    case 'stat': return 'Value';
    case 'table': return 'Table';
    case 'text': return 'Text';
    default: return 'Chart';
  }
}
