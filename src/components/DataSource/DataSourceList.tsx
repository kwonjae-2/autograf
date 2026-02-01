/**
 * DataSource List Component
 * 저장된 데이터소스 목록 표시
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
  onTestConnection,
}: DataSourceListProps) {
  if (dataSources.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <svg
          className="mx-auto h-8 w-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14M12 5l7 7-7 7"
          />
        </svg>
        <p className="text-sm">저장된 데이터소스가 없습니다</p>
        <p className="text-xs mt-1">새 데이터소스를 추가해주세요</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {dataSources.map((ds) => (
        <li
          key={ds.id}
          className={`
            p-3 cursor-pointer transition-colors
            ${activeId === ds.id ? 'bg-primary-50' : 'hover:bg-gray-50'}
          `}
          onClick={() => onSelect(ds.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <ConnectionStatus status={ds.status} size="sm" />
              <div className="min-w-0 flex-1">
                <p
                  className={`
                    text-sm font-medium truncate
                    ${activeId === ds.id ? 'text-primary-700' : 'text-gray-900'}
                  `}
                >
                  {ds.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{ds.url}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              {onTestConnection && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTestConnection(ds);
                  }}
                  className="p-1 text-gray-400 hover:text-primary-600 rounded"
                  title="연결 테스트"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(ds);
                  }}
                  className="p-1 text-gray-400 hover:text-primary-600 rounded"
                  title="편집"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`"${ds.name}" 데이터소스를 삭제하시겠습니까?`)) {
                      onDelete(ds.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 rounded"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
