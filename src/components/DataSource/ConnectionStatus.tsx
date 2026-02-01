/**
 * Connection Status Indicator
 */

import type { ConnectionStatus as StatusType } from '../../types';

interface ConnectionStatusProps {
  status: StatusType;
}

const statusStyles: Record<StatusType, { bg: string; ring?: string }> = {
  unknown: { bg: 'bg-slate-500' },
  connecting: { bg: 'bg-amber-500', ring: 'ring-2 ring-amber-500/30' },
  connected: { bg: 'bg-emerald-500' },
  error: { bg: 'bg-red-500' },
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const style = statusStyles[status];

  return (
    <div className={`w-2.5 h-2.5 rounded-full ${style.bg} ${style.ring ?? ''} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
  );
}
