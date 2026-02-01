/**
 * useDataSources Hook
 * 데이터소스 목록 관리 및 활성 데이터소스 선택
 */

import { useState, useCallback, useEffect } from 'react';
import type { DataSource, DataSourceInput } from '../types';
import {
  getAllDataSources,
  createDataSource,
  updateDataSource,
  deleteDataSource,
} from '../services/storage/dataSourceService';
import { testDataSourceConnection, type ConnectionTestResult } from '../services/prometheus/connectionTest';
import { AppError } from '../utils/errors';

interface UseDataSourcesResult {
  dataSources: DataSource[];
  activeDataSource: DataSource | null;
  isLoading: boolean;
  error: AppError | null;
  setActiveDataSource: (id: string | null) => void;
  addDataSource: (input: DataSourceInput) => DataSource | null;
  editDataSource: (id: string, input: Partial<DataSourceInput>) => DataSource | null;
  removeDataSource: (id: string) => boolean;
  testConnection: (dataSource: DataSource) => Promise<ConnectionTestResult>;
  refresh: () => void;
}

const ACTIVE_DS_KEY = 'autograf:activeDataSourceId';

export function useDataSources(): UseDataSourcesResult {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  // Load datasources on mount
  const refresh = useCallback(() => {
    try {
      const loaded = getAllDataSources();
      setDataSources(loaded);

      // Restore active datasource from localStorage
      const savedActiveId = localStorage.getItem(ACTIVE_DS_KEY);
      if (savedActiveId && loaded.some((ds) => ds.id === savedActiveId)) {
        setActiveId(savedActiveId);
      } else if (loaded.length > 0 && loaded[0]) {
        setActiveId(loaded[0].id);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof AppError ? err : AppError.fromError(err));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Get active datasource
  const activeDataSource = dataSources.find((ds) => ds.id === activeId) ?? null;

  // Set active datasource
  const setActiveDataSource = useCallback((id: string | null) => {
    setActiveId(id);
    if (id) {
      localStorage.setItem(ACTIVE_DS_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_DS_KEY);
    }
  }, []);

  // Add datasource
  const addDataSource = useCallback(
    (input: DataSourceInput): DataSource | null => {
      try {
        const created = createDataSource(input);
        setDataSources((prev) => [...prev, created]);
        setActiveDataSource(created.id);
        setError(null);
        return created;
      } catch (err) {
        setError(err instanceof AppError ? err : AppError.fromError(err));
        return null;
      }
    },
    [setActiveDataSource]
  );

  // Edit datasource
  const editDataSource = useCallback(
    (id: string, input: Partial<DataSourceInput>): DataSource | null => {
      try {
        const updated = updateDataSource(id, input);
        setDataSources((prev) =>
          prev.map((ds) => (ds.id === id ? updated : ds))
        );
        setError(null);
        return updated;
      } catch (err) {
        setError(err instanceof AppError ? err : AppError.fromError(err));
        return null;
      }
    },
    []
  );

  // Remove datasource
  const removeDataSource = useCallback(
    (id: string): boolean => {
      const success = deleteDataSource(id);
      if (success) {
        setDataSources((prev) => prev.filter((ds) => ds.id !== id));
        if (activeId === id) {
          const remaining = dataSources.filter((ds) => ds.id !== id);
          setActiveDataSource(remaining.length > 0 && remaining[0] ? remaining[0].id : null);
        }
      }
      return success;
    },
    [activeId, dataSources, setActiveDataSource]
  );

  // Test connection
  const testConnectionFn = useCallback(
    async (dataSource: DataSource): Promise<ConnectionTestResult> => {
      setIsLoading(true);
      try {
        const result = await testDataSourceConnection(dataSource);
        // Refresh to get updated status
        refresh();
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    [refresh]
  );

  return {
    dataSources,
    activeDataSource,
    isLoading,
    error,
    setActiveDataSource,
    addDataSource,
    editDataSource,
    removeDataSource,
    testConnection: testConnectionFn,
    refresh,
  };
}
