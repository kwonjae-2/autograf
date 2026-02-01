/**
 * Series Analyzer
 * 시리즈 수와 데이터 포인트를 분석합니다.
 */

import type { ResultData } from '../../types';

/**
 * Count the number of series in the result
 */
export function countSeries(data: ResultData): number {
  switch (data.resultType) {
    case 'matrix':
    case 'vector':
      return data.result.length;
    case 'scalar':
    case 'string':
      return 1;
  }
}

/**
 * Count total data points across all series
 */
export function countDataPoints(data: ResultData): number {
  switch (data.resultType) {
    case 'matrix':
      return data.result.reduce((total, series) => total + series.values.length, 0);
    case 'vector':
      return data.result.length;
    case 'scalar':
    case 'string':
      return 1;
  }
}

/**
 * Get the maximum data points in a single series
 */
export function getMaxSeriesLength(data: ResultData): number {
  switch (data.resultType) {
    case 'matrix':
      return Math.max(...data.result.map((series) => series.values.length), 0);
    case 'vector':
      return 1;
    case 'scalar':
    case 'string':
      return 1;
  }
}

/**
 * Check if data is large (> 10000 points)
 */
export function isLargeDataset(data: ResultData): boolean {
  return countDataPoints(data) > 10000;
}
