/**
 * Time Range Presets
 * 미리 정의된 시간 범위 옵션
 */

export interface TimeRangePreset {
  id: string;
  label: string;
  duration: number; // in seconds
  defaultStep: string;
}

export const TIME_RANGE_PRESETS: TimeRangePreset[] = [
  { id: '15m', label: '최근 15분', duration: 15 * 60, defaultStep: '15s' },
  { id: '1h', label: '최근 1시간', duration: 60 * 60, defaultStep: '15s' },
  { id: '3h', label: '최근 3시간', duration: 3 * 60 * 60, defaultStep: '30s' },
  { id: '6h', label: '최근 6시간', duration: 6 * 60 * 60, defaultStep: '1m' },
  { id: '12h', label: '최근 12시간', duration: 12 * 60 * 60, defaultStep: '2m' },
  { id: '24h', label: '최근 24시간', duration: 24 * 60 * 60, defaultStep: '5m' },
  { id: '2d', label: '최근 2일', duration: 2 * 24 * 60 * 60, defaultStep: '10m' },
  { id: '7d', label: '최근 7일', duration: 7 * 24 * 60 * 60, defaultStep: '30m' },
  { id: '30d', label: '최근 30일', duration: 30 * 24 * 60 * 60, defaultStep: '2h' },
];

export const DEFAULT_PRESET_ID = '1h';

/**
 * Get preset by ID
 */
export function getPresetById(id: string): TimeRangePreset | undefined {
  return TIME_RANGE_PRESETS.find((p) => p.id === id);
}

/**
 * Get default preset
 */
export function getDefaultPreset(): TimeRangePreset {
  return TIME_RANGE_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ?? TIME_RANGE_PRESETS[0]!;
}
