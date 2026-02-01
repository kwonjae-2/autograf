/**
 * LocalStorage Service
 */

import type { DataSource } from '../../types';
import { AppError } from '../../utils/errors';

const STORAGE_KEY = 'autograf:datasources';

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save datasources to localStorage
 */
export function saveDataSources(dataSources: DataSource[]): void {
  if (!isStorageAvailable()) {
    throw new AppError(
      'storage',
      '로컬 스토리지를 사용할 수 없습니다.',
      'localStorage not available',
      '브라우저 설정을 확인하거나, 프라이빗 브라우징 모드를 해제해주세요.'
    );
  }

  try {
    const json = JSON.stringify(dataSources);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    throw new AppError(
      'storage',
      '데이터를 저장할 수 없습니다.',
      error instanceof Error ? error.message : String(error),
      '저장 공간이 충분한지 확인해주세요.'
    );
  }
}

/**
 * Load datasources from localStorage
 */
export function loadDataSources(): DataSource[] {
  if (!isStorageAvailable()) {
    return [];
  }

  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return [];
    }
    return JSON.parse(json) as DataSource[];
  } catch {
    // If parse fails, return empty array
    return [];
  }
}

/**
 * Remove all datasources from localStorage
 */
export function removeDataSources(): void {
  if (isStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if storage is available
 */
export function checkStorageAvailability(): boolean {
  return isStorageAvailable();
}
