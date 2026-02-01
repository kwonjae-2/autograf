/**
 * Time Range Resolver
 * 상대 시간을 절대 시간(Unix timestamp)으로 변환
 */

import type { TimeRange, RelativeTimeRange, AbsoluteTimeRange } from '../types';
import { getPresetById } from './timeRangePresets';

export interface ResolvedTimeRange {
  start: number; // Unix timestamp (seconds)
  end: number; // Unix timestamp (seconds)
}

/**
 * Resolve time range to absolute timestamps
 */
export function resolveTimeRange(timeRange: TimeRange): ResolvedTimeRange {
  if (timeRange.type === 'absolute') {
    return {
      start: (timeRange as AbsoluteTimeRange).from,
      end: (timeRange as AbsoluteTimeRange).to,
    };
  }

  return resolveRelativeTimeRange(timeRange as RelativeTimeRange);
}

/**
 * Resolve relative time range (e.g., "now-1h" to "now")
 */
function resolveRelativeTimeRange(timeRange: RelativeTimeRange): ResolvedTimeRange {
  const now = Math.floor(Date.now() / 1000);

  const start = parseRelativeTime(timeRange.from, now);
  const end = parseRelativeTime(timeRange.to, now);

  return { start, end };
}

/**
 * Parse relative time string like "now-1h", "now-30m", "now"
 */
function parseRelativeTime(timeStr: string, now: number): number {
  if (timeStr === 'now') {
    return now;
  }

  const match = timeStr.match(/^now-(\d+)([smhdw])$/);
  if (!match) {
    return now;
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    w: 7 * 24 * 60 * 60,
  };

  const multiplier = multipliers[unit] ?? 1;
  return now - value * multiplier;
}

/**
 * Create time range from preset ID
 */
export function createTimeRangeFromPreset(presetId: string): TimeRange {
  const preset = getPresetById(presetId);
  if (!preset) {
    return {
      type: 'relative',
      from: 'now-1h',
      to: 'now',
    };
  }

  // Convert duration to relative time string
  const durationStr = formatDuration(preset.duration);

  return {
    type: 'relative',
    from: `now-${durationStr}`,
    to: 'now',
  };
}

/**
 * Format duration in seconds to time string (e.g., "1h", "30m")
 */
function formatDuration(seconds: number): string {
  if (seconds >= 7 * 24 * 60 * 60 && seconds % (7 * 24 * 60 * 60) === 0) {
    return `${seconds / (7 * 24 * 60 * 60)}w`;
  }
  if (seconds >= 24 * 60 * 60 && seconds % (24 * 60 * 60) === 0) {
    return `${seconds / (24 * 60 * 60)}d`;
  }
  if (seconds >= 60 * 60 && seconds % (60 * 60) === 0) {
    return `${seconds / (60 * 60)}h`;
  }
  if (seconds >= 60 && seconds % 60 === 0) {
    return `${seconds / 60}m`;
  }
  return `${seconds}s`;
}

/**
 * Get resolved time range from preset
 */
export function getResolvedTimeRangeFromPreset(presetId: string): ResolvedTimeRange {
  const timeRange = createTimeRangeFromPreset(presetId);
  return resolveTimeRange(timeRange);
}
