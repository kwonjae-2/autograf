/**
 * Connection Test Service
 * 데이터소스 연결 테스트 및 상태 업데이트
 */

import type { DataSource, ConnectionStatus } from '../../types';
import { testConnection } from './client';
import { updateDataSourceStatus } from '../storage/dataSourceService';
import { AppError } from '../../utils/errors';

export interface ConnectionTestResult {
  success: boolean;
  status: ConnectionStatus;
  error?: AppError;
  latencyMs?: number;
}

/**
 * Test connection to a Prometheus server and update datasource status
 */
export async function testDataSourceConnection(
  dataSource: DataSource
): Promise<ConnectionTestResult> {
  const startTime = performance.now();

  // Update status to connecting
  updateDataSourceStatus(dataSource.id, 'connecting');

  try {
    const success = await testConnection({
      baseUrl: dataSource.url,
      auth: dataSource.auth,
      timeout: 10000,
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (success) {
      updateDataSourceStatus(dataSource.id, 'connected');
      return {
        success: true,
        status: 'connected',
        latencyMs,
      };
    } else {
      updateDataSourceStatus(dataSource.id, 'error');
      return {
        success: false,
        status: 'error',
        error: new AppError(
          'connection',
          '연결에 실패했습니다.',
          null,
          'URL을 확인해주세요.'
        ),
      };
    }
  } catch (error) {
    updateDataSourceStatus(dataSource.id, 'error');

    const appError =
      error instanceof AppError
        ? error
        : AppError.fromError(error);

    return {
      success: false,
      status: 'error',
      error: appError,
    };
  }
}

/**
 * Test connection without updating datasource (for preview)
 */
export async function testConnectionPreview(
  url: string,
  auth?: { type: 'bearer'; token: string } | null
): Promise<ConnectionTestResult> {
  const startTime = performance.now();

  try {
    const success = await testConnection({
      baseUrl: url,
      auth,
      timeout: 10000,
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (success) {
      return {
        success: true,
        status: 'connected',
        latencyMs,
      };
    } else {
      return {
        success: false,
        status: 'error',
        error: new AppError(
          'connection',
          '연결에 실패했습니다.',
          null,
          'URL을 확인해주세요.'
        ),
      };
    }
  } catch (error) {
    const appError =
      error instanceof AppError
        ? error
        : AppError.fromError(error);

    return {
      success: false,
      status: 'error',
      error: appError,
    };
  }
}
