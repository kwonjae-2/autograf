/**
 * DataSource List
 */

import type { DataSource } from '../../types';
import { ConnectionStatus } from './ConnectionStatus';

interface DataSourceListProps {
  dataSources: DataSource[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onEdit?: (dataSource: DataSource) => void;
  onDelete?: (id: string) => void;
  onTestConnection?: (dataSource: DataSource) => void;
}

export function DataSourceList({
  dataSources,
  activeId,
  onSelect,
  onEdit,
  onDelete,
}: DataSourceListProps) {
  if (dataSources.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-800/50 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <p className="text-sm text-slate-500">No datasources</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {dataSources.map((ds) => (
        <div
          key={ds.id}
          onClick={() => onSelect(ds.id)}
          className={`
            group relative p-3 rounded-lg cursor-pointer transition-all
            ${activeId === ds.id 
              ? 'bg-indigo-500/10 border border-indigo-500/30' 
              : 'hover:bg-slate-800/50 border border-transparent'}
          `}
        >
          <div className="flex items-center gap-3">
            <ConnectionStatus status={ds.status} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${activeId === ds.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                {ds.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{ds.url}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
            {onEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(ds); }}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-700"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this datasource?')) onDelete(ds.id);
                }}
                className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-700"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
