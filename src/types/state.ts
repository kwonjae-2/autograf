/**
 * AppState - 애플리케이션 상태
 */

import type { DataSource } from './datasource';
import type { Query } from './query';
import type { QueryResult } from './result';
import type { Visualization } from './visualization';

export type ErrorType =
  | 'connection'
  | 'auth'
  | 'query'
  | 'timeout'
  | 'cors'
  | 'visualization'
  | 'storage'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  details: string | null;
  suggestion: string | null;
}

export interface AppState {
  dataSources: DataSource[];
  activeDataSourceId: string | null;
  currentQuery: Query | null;
  queryResult: QueryResult | null;
  visualization: Visualization | null;
  isLoading: boolean;
  error: AppError | null;
}

export const initialAppState: AppState = {
  dataSources: [],
  activeDataSourceId: null,
  currentQuery: null,
  queryResult: null,
  visualization: null,
  isLoading: false,
  error: null,
};
