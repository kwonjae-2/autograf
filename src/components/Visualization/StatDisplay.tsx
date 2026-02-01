/**
 * Stat Display
 */

import type { ChartConfig } from '../../types';

interface StatDisplayProps {
  config: ChartConfig;
}

export function StatDisplay({ config }: StatDisplayProps) {
  return (
    <div className="py-12 text-center">
      <div className="text-5xl font-semibold text-slate-100 tabular-nums">
        {config.value ?? 'N/A'}
      </div>
      {config.unit && (
        <div className="mt-2 text-sm text-slate-500">{config.unit}</div>
      )}
    </div>
  );
}
