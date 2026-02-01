/**
 * Prometheus Response Parser
 */

import type { QueryResult, ResultData, QueryResultError } from '../../types';
import { isSuccessResult, isErrorResult } from '../../types';
import { AppError } from '../../utils/errors';

/**
 * Parse and validate query result
 */
export function parseQueryResult(result: QueryResult): ResultData {
  if (isErrorResult(result)) {
    throw new AppError(
      'query',
      result.error,
      `Error type: ${result.errorType}`,
      'PromQL 문법을 확인하거나 다른 쿼리를 시도해보세요.'
    );
  }

  if (!isSuccessResult(result)) {
    throw new AppError(
      'unknown',
      '알 수 없는 응답 형식입니다.',
      null,
      '다시 시도해주세요.'
    );
  }

  return result.data;
}

/**
 * Normalize Prometheus error to AppError
 */
export function normalizeError(result: QueryResultError): AppError {
  const { errorType, error } = result;

  switch (errorType) {
    case 'bad_data':
      return new AppError('query', error, 'bad_data', 'PromQL 문법을 확인해주세요.');
    case 'timeout':
      return new AppError('timeout', error, 'timeout', '시간 범위를 줄이거나 step을 늘려보세요.');
    case 'canceled':
      return new AppError('query', '쿼리가 취소되었습니다.', 'canceled', null);
    case 'execution':
      return new AppError('query', error, 'execution', '쿼리를 단순화해보세요.');
    case 'internal':
      return new AppError('connection', '서버 내부 오류가 발생했습니다.', 'internal', '잠시 후 다시 시도해주세요.');
    default:
      return new AppError('unknown', error, errorType, null);
  }
}

/**
 * Check if result is empty
 */
export function isEmptyResult(data: ResultData): boolean {
  switch (data.resultType) {
    case 'matrix':
    case 'vector':
      return data.result.length === 0;
    case 'scalar':
    case 'string':
      return false; // scalar and string always have a value
  }
}

/**
 * Get result count (number of series or single value)
 */
export function getResultCount(data: ResultData): number {
  switch (data.resultType) {
    case 'matrix':
    case 'vector':
      return data.result.length;
    case 'scalar':
    case 'string':
      return 1;
  }
}
