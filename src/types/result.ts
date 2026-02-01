/**
 * QueryResult - Prometheus API 응답 데이터
 */

export type ResultType = 'matrix' | 'vector' | 'scalar' | 'string';

export interface MatrixMetricResult {
  metric: Record<string, string>;
  values: [number, string][]; // [timestamp, value][]
}

export interface VectorMetricResult {
  metric: Record<string, string>;
  value: [number, string]; // [timestamp, value]
}

export type ScalarResult = [number, string]; // [timestamp, value]
export type StringResult = [number, string]; // [timestamp, value]

export interface MatrixResultData {
  resultType: 'matrix';
  result: MatrixMetricResult[];
}

export interface VectorResultData {
  resultType: 'vector';
  result: VectorMetricResult[];
}

export interface ScalarResultData {
  resultType: 'scalar';
  result: ScalarResult;
}

export interface StringResultData {
  resultType: 'string';
  result: StringResult;
}

export type ResultData = MatrixResultData | VectorResultData | ScalarResultData | StringResultData;

export interface QueryResultSuccess {
  status: 'success';
  data: ResultData;
}

export interface QueryResultError {
  status: 'error';
  errorType: string;
  error: string;
}

export type QueryResult = QueryResultSuccess | QueryResultError;

/**
 * Type guard functions
 */
export function isMatrixResult(data: ResultData): data is MatrixResultData {
  return data.resultType === 'matrix';
}

export function isVectorResult(data: ResultData): data is VectorResultData {
  return data.resultType === 'vector';
}

export function isScalarResult(data: ResultData): data is ScalarResultData {
  return data.resultType === 'scalar';
}

export function isStringResult(data: ResultData): data is StringResultData {
  return data.resultType === 'string';
}

export function isSuccessResult(result: QueryResult): result is QueryResultSuccess {
  return result.status === 'success';
}

export function isErrorResult(result: QueryResult): result is QueryResultError {
  return result.status === 'error';
}
