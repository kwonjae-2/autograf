/**
 * Query - PromQL 쿼리와 실행 파라미터
 */

export type QueryType = 'instant' | 'range';

export interface RelativeTimeRange {
  type: 'relative';
  from: string; // e.g., "now-1h"
  to: string; // e.g., "now"
}

export interface AbsoluteTimeRange {
  type: 'absolute';
  from: number; // Unix timestamp
  to: number; // Unix timestamp
}

export type TimeRange = RelativeTimeRange | AbsoluteTimeRange;

export interface Query {
  expr: string;
  timeRange: TimeRange;
  step?: string; // e.g., "15s", "1m"
  queryType: QueryType;
}

export interface QueryParams {
  url: string;
  query: string;
  start?: number;
  end?: number;
  step?: string;
}

export const DEFAULT_TIME_RANGE: RelativeTimeRange = {
  type: 'relative',
  from: 'now-1h',
  to: 'now',
};

export const DEFAULT_STEP = '15s';
