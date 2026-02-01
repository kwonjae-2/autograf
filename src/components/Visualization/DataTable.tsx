/**
 * Data Table
 */

import type { ChartConfig } from '../../types';

interface DataTableProps {
  config: ChartConfig;
}

export function DataTable({ config }: DataTableProps) {
  const { columns = [], rows = [] } = config;

  if (columns.length === 0 || rows.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        No data
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {rows.map((row, i) => (
            <tr key={row['__key'] as number ?? i} className="hover:bg-slate-800/30">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2 font-mono text-slate-300 whitespace-nowrap">
                  {String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 text-xs text-slate-600 border-t border-slate-800">
        {rows.length} rows
      </div>
    </div>
  );
}
