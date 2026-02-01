/**
 * Connection Status Indicator Component
 */

import type { ConnectionStatus as ConnectionStatusType } from '../../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  ConnectionStatusType,
  { color: string; label: string; animate?: boolean }
> = {
  unknown: {
    color: 'bg-gray-400',
    label: '알 수 없음',
  },
  connecting: {
    color: 'bg-yellow-400',
    label: '연결 중...',
    animate: true,
  },
  connected: {
    color: 'bg-green-500',
    label: '연결됨',
  },
  error: {
    color: 'bg-red-500',
    label: '연결 실패',
  },
};

export function ConnectionStatus({
  status,
  showLabel = false,
  size = 'md',
}: ConnectionStatusProps) {
  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          ${dotSize} rounded-full ${config.color}
          ${config.animate ? 'animate-pulse' : ''}
        `}
        aria-label={config.label}
      />
      {showLabel && (
        <span
          className={`
            ${size === 'sm' ? 'text-xs' : 'text-sm'} 
            text-gray-600
          `}
        >
          {config.label}
        </span>
      )}
    </div>
  );
}
