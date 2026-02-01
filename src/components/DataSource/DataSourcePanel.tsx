/**
 * DataSource Panel
 */

import { useState } from 'react';
import type { DataSource, DataSourceInput, AuthConfig } from '../../types';
import { DataSourceList } from './DataSourceList';
import { DataSourceForm } from './DataSourceForm';
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
    <div className="card h-fit">
      <div className="card-header">
        <span className="text-sm font-medium text-slate-200">Sources</span>
        {mode === 'list' && (
          <button
            onClick={() => setMode('add')}
            className="btn-icon"
            title="Add datasource"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        {mode !== 'list' && (
          <button onClick={handleCancel} className="btn-icon" title="Back">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="card-body">
        {mode === 'list' && (
          <DataSourceList
            dataSources={dataSources}
            activeId={activeDataSource?.id ?? null}
            onSelect={onSelect}
            onEdit={handleStartEdit}
            onDelete={onDelete}
            onTestConnection={(ds) => void onTestConnection(ds)}
          />
        )}

        {mode === 'add' && (
          <DataSourceForm
            onSubmit={handleAdd}
            onCancel={handleCancel}
            onTestConnection={handleTestConnection}
            isLoading={isLoading}
          />
        )}

        {mode === 'edit' && editingDataSource && (
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
          />
        )}
      </div>
    </div>
  );
}
