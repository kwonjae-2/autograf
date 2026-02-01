/**
 * Result Type Analyzer
 * 쿼리 결과의 타입을 분석합니다.
 */

import type { ResultData, ResultType } from '../../types';

/**
 * Detect the result type from query result data
 */
export function detectResultType(data: ResultData): ResultType {
  return data.resultType;
}

/**
 * Check if result has time series data
 */
export function hasTimeSeriesData(data: ResultData): boolean {
  return data.resultType === 'matrix';
}

/**
 * Check if result is a single value
 */
export function isSingleValue(data: ResultData): boolean {
  switch (data.resultType) {
    case 'scalar':
    case 'string':
      return true;
    case 'vector':
      return data.result.length === 1;
    case 'matrix':
      return data.result.length === 1 && data.result[0]?.values.length === 1;
  }
}

/**
 * Check if result is tabular (multiple vectors)
 */
export function isTabular(data: ResultData): boolean {
  return data.resultType === 'vector' && data.result.length > 1;
}
