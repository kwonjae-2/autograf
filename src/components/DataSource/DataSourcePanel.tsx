/**
 * DataSource Panel Container
 * 데이터소스 목록 및 관리 UI
 */

import { useState } from 'react';
import type { DataSource, DataSourceInput, AuthConfig } from '../../types';
import { DataSourceList } from './DataSourceList';
import { DataSourceForm } from './DataSourceForm';
import { ConnectionStatus } from './ConnectionStatus';
import { Button } from '../common';
import { testConnectionPreview } from '../../services/prometheus/connectionTest';

interface DataSourcePanelProps {
  dataSources: DataSource[];
  activeDataSource: DataSource | null;
  onSelect: (id: string) => void;
  onAdd: (input: DataSourceInput) => DataSource | null;
  onEdit: (id: string, input: Partial<DataSourceInput>) => DataSource | null;
  onDelete: (id: string) => boolean;
  onTestConnection: (dataSource: DataSource) => Promise<{ success: boolean }>;
}

type PanelMode = 'list' | 'add' | 'edit';

export function DataSourcePanel({
  dataSources,
  activeDataSource,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onTestConnection,
}: DataSourcePanelProps) {
  const [mode, setMode] = useState<PanelMode>('list');
  const [editingDataSource, setEditingDataSource] = useState<DataSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = (input: DataSourceInput) => {
    setIsLoading(true);
    try {
      const created = onAdd(input);
      if (created) {
        setMode('list');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (input: DataSourceInput) => {
    if (!editingDataSource) return;

    setIsLoading(true);
    try {
      const updated = onEdit(editingDataSource.id, input);
      if (updated) {
        setMode('list');
        setEditingDataSource(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (ds: DataSource) => {
    setEditingDataSource(ds);
    setMode('edit');
  };

  const handleCancel = () => {
    setMode('list');
    setEditingDataSource(null);
  };

  const handleTestConnection = async (url: string, auth: AuthConfig | null) => {
    const result = await testConnectionPreview(url, auth);
    return result.success;
  };

  return (
    <div className="card">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">데이터소스</h3>
        {mode === 'list' && (
          <Button size="sm" onClick={() => setMode('add')}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            추가
          </Button>
        )}
      </div>

      <div className="p-4">
        {mode === 'list' && (
          <>
            {activeDataSource && (
              <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ConnectionStatus status={activeDataSource.status} />
                    <div>
                      <p className="text-sm font-medium text-primary-900">
                        {activeDataSource.name}
                      </p>
                      <p className="text-xs text-primary-600 truncate max-w-xs">
                        {activeDataSource.url}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void onTestConnection(activeDataSource)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    연결 테스트
                  </button>
                </div>
              </div>
            )}

            <DataSourceList
              dataSources={dataSources}
              activeId={activeDataSource?.id ?? null}
              onSelect={onSelect}
              onEdit={handleStartEdit}
              onDelete={onDelete}
              onTestConnection={(ds) => void onTestConnection(ds)}
            />
          </>
        )}

        {mode === 'add' && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">새 데이터소스 추가</h4>
            <DataSourceForm
              onSubmit={handleAdd}
              onCancel={handleCancel}
              onTestConnection={handleTestConnection}
              isLoading={isLoading}
              submitLabel="추가"
            />
          </div>
        )}

        {mode === 'edit' && editingDataSource && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">데이터소스 편집</h4>
            <DataSourceForm
              initialValues={{
                name: editingDataSource.name,
                url: editingDataSource.url,
                token: editingDataSource.auth?.token ?? '',
              }}
              onSubmit={handleEdit}
              onCancel={handleCancel}
              onTestConnection={handleTestConnection}
              isLoading={isLoading}
              submitLabel="저장"
            />
          </div>
        )}
      </div>
    </div>
  );
}
