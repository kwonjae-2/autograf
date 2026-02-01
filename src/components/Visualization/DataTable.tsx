/**
 * Data Table Component
 */

import type { ChartConfig } from '../../types';

interface DataTableProps {
  config: ChartConfig;
  className?: string;
}

export function DataTable({ config, className = '' }: DataTableProps) {
  const { columns = [], rows = [] } = config;

  if (columns.length === 0 || rows.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={row['__key'] as number ?? rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-mono"
                >
                  {String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500">
        총 {rows.length}개 행
      </div>
    </div>
  );
}
