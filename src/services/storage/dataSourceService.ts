/**
 * DataSource CRUD Service
 * 데이터소스 생성, 조회, 수정, 삭제 기능
 */

import type { DataSource, DataSourceInput, ConnectionStatus } from '../../types';
import { saveDataSources, loadDataSources } from './localStorage';
import { AppError } from '../../utils/errors';

/**
 * Generate unique ID for datasource
 */
function generateId(): string {
  return `ds_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all datasources
 */
export function getAllDataSources(): DataSource[] {
  return loadDataSources();
}

/**
 * Get datasource by ID
 */
export function getDataSourceById(id: string): DataSource | null {
  const dataSources = loadDataSources();
  return dataSources.find((ds) => ds.id === id) ?? null;
}

/**
 * Create new datasource
 */
export function createDataSource(input: DataSourceInput): DataSource {
  const dataSources = loadDataSources();

  // Check for duplicate name
  if (dataSources.some((ds) => ds.name === input.name)) {
    throw new AppError(
      'storage',
      '동일한 이름의 데이터소스가 이미 존재합니다.',
      `Name: ${input.name}`,
      '다른 이름을 사용해주세요.'
    );
  }

  const now = Date.now();
  const newDataSource: DataSource = {
    id: generateId(),
    name: input.name,
    url: normalizeUrl(input.url),
    auth: input.auth ?? null,
    status: 'unknown',
    createdAt: now,
    updatedAt: now,
  };

  dataSources.push(newDataSource);
  saveDataSources(dataSources);

  return newDataSource;
}

/**
 * Update existing datasource
 */
export function updateDataSource(
  id: string,
  input: Partial<DataSourceInput>
): DataSource {
  const dataSources = loadDataSources();
  const index = dataSources.findIndex((ds) => ds.id === id);

  if (index === -1) {
    throw new AppError(
      'storage',
      '데이터소스를 찾을 수 없습니다.',
      `ID: ${id}`,
      '데이터소스 목록을 새로고침해주세요.'
    );
  }

  const existing = dataSources[index]!;

  // Check for duplicate name if name is being changed
  if (input.name && input.name !== existing.name) {
    if (dataSources.some((ds) => ds.name === input.name && ds.id !== id)) {
      throw new AppError(
        'storage',
        '동일한 이름의 데이터소스가 이미 존재합니다.',
        `Name: ${input.name}`,
        '다른 이름을 사용해주세요.'
      );
    }
  }

  const updated: DataSource = {
    ...existing,
    name: input.name ?? existing.name,
    url: input.url ? normalizeUrl(input.url) : existing.url,
    auth: input.auth !== undefined ? input.auth ?? null : existing.auth,
    status: 'unknown', // Reset status after update
    updatedAt: Date.now(),
  };

  dataSources[index] = updated;
  saveDataSources(dataSources);

  return updated;
}

/**
 * Update datasource connection status
 */
export function updateDataSourceStatus(
  id: string,
  status: ConnectionStatus
): DataSource {
  const dataSources = loadDataSources();
  const index = dataSources.findIndex((ds) => ds.id === id);

  if (index === -1) {
    throw new AppError(
      'storage',
      '데이터소스를 찾을 수 없습니다.',
      `ID: ${id}`,
      null
    );
  }

  const existing = dataSources[index]!;
  const updated: DataSource = {
    ...existing,
    status,
    updatedAt: Date.now(),
  };

  dataSources[index] = updated;
  saveDataSources(dataSources);

  return updated;
}

/**
 * Delete datasource
 */
export function deleteDataSource(id: string): boolean {
  const dataSources = loadDataSources();
  const index = dataSources.findIndex((ds) => ds.id === id);

  if (index === -1) {
    return false;
  }

  dataSources.splice(index, 1);
  saveDataSources(dataSources);

  return true;
}

/**
 * Normalize URL (remove trailing slash)
 */
function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}
