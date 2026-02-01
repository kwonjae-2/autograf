/**
 * Prometheus HTTP API Client
 */

import type { QueryResult, AuthConfig } from '../../types';
import { AppError } from '../../utils/errors';

export interface PrometheusClientConfig {
  baseUrl: string;
  auth?: AuthConfig | null;
  timeout?: number;
}

/**
 * Build request headers
 */
function buildHeaders(auth?: AuthConfig | null): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  if (auth?.token) {
    headers['Authorization'] = `Bearer ${auth.token}`;
  }

  return headers;
}

/**
 * Execute instant query
 */
export async function query(
  config: PrometheusClientConfig,
  expr: string,
  time?: number
): Promise<QueryResult> {
  const url = new URL('/api/v1/query', config.baseUrl);
  url.searchParams.set('query', expr);
  if (time !== undefined) {
    url.searchParams.set('time', time.toString());
  }

  return executeRequest(url, config);
}

/**
 * Execute range query
 */
export async function queryRange(
  config: PrometheusClientConfig,
  expr: string,
  start: number,
  end: number,
  step: string
): Promise<QueryResult> {
  const url = new URL('/api/v1/query_range', config.baseUrl);
  url.searchParams.set('query', expr);
  url.searchParams.set('start', start.toString());
  url.searchParams.set('end', end.toString());
  url.searchParams.set('step', step);

  return executeRequest(url, config);
}

/**
 * Test connection by fetching labels
 */
export async function testConnection(config: PrometheusClientConfig): Promise<boolean> {
  const url = new URL('/api/v1/labels', config.baseUrl);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(config.auth),
      signal: AbortSignal.timeout(config.timeout ?? 10000),
    });

    if (response.ok) {
      return true;
    }

    if (response.status === 401 || response.status === 403) {
      throw new AppError('auth', '인증에 실패했습니다.', `HTTP ${response.status}`, '토큰을 확인해주세요.');
    }

    return false;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AppError(
        'cors',
        'Prometheus 서버에 연결할 수 없습니다.',
        'CORS 또는 네트워크 오류',
        'Prometheus 서버의 CORS 설정을 확인하거나, 프록시를 통해 접근해주세요.'
      );
    }

    throw AppError.fromError(error);
  }
}

/**
 * Execute HTTP request with error handling
 */
async function executeRequest(url: URL, config: PrometheusClientConfig): Promise<QueryResult> {
  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: buildHeaders(config.auth),
      signal: AbortSignal.timeout(config.timeout ?? 30000),
    });

    if (!response.ok) {
      await handleHttpError(response);
    }

    const data = (await response.json()) as QueryResult;
    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppError(
        'timeout',
        '요청 시간이 초과되었습니다.',
        null,
        '시간 범위를 줄이거나 step을 늘려보세요.'
      );
    }

    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AppError(
        'cors',
        'Prometheus 서버에 연결할 수 없습니다.',
        'CORS 또는 네트워크 오류',
        'Prometheus 서버의 CORS 설정을 확인하거나, 프록시를 통해 접근해주세요.'
      );
    }

    throw AppError.fromError(error);
  }
}

/**
 * Handle HTTP error responses
 */
async function handleHttpError(response: Response): Promise<never> {
  const status = response.status;

  if (status === 401) {
    throw new AppError('auth', '인증에 실패했습니다.', 'HTTP 401 Unauthorized', '토큰을 확인해주세요.');
  }

  if (status === 403) {
    throw new AppError('auth', '접근 권한이 없습니다.', 'HTTP 403 Forbidden', '권한을 확인해주세요.');
  }

  if (status === 400) {
    let errorMessage = '잘못된 요청입니다.';
    try {
      const errorData = (await response.json()) as { error?: string };
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // ignore JSON parse error
    }
    throw new AppError('query', errorMessage, `HTTP ${status}`, 'PromQL 문법을 확인해주세요.');
  }

  if (status === 503 || status === 504) {
    throw new AppError(
      'timeout',
      '서버 응답 시간이 초과되었습니다.',
      `HTTP ${status}`,
      '쿼리를 단순화하거나 시간 범위를 줄여보세요.'
    );
  }

  throw new AppError('connection', `서버 오류가 발생했습니다.`, `HTTP ${status}`, '잠시 후 다시 시도해주세요.');
}
