/**
 * Stat Display Component
 */

import type { ChartConfig } from '../../types';

interface StatDisplayProps {
  config: ChartConfig;
  className?: string;
}

export function StatDisplay({ config, className = '' }: StatDisplayProps) {
  const { value, unit } = config;

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <div className="text-5xl font-bold text-gray-900 tabular-nums">
          {value ?? 'N/A'}
          {unit && <span className="text-2xl font-normal text-gray-500 ml-2">{unit}</span>}
        </div>
        <p className="mt-2 text-sm text-gray-500">현재 값</p>
      </div>
    </div>
  );
}
