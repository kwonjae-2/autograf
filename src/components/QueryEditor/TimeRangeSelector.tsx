/**
 * Time Range Selector Component
 */

import { TIME_RANGE_PRESETS } from '../../utils/timeRangePresets';

interface TimeRangeSelectorProps {
  value: string;
  onChange: (presetId: string, defaultStep: string) => void;
  disabled?: boolean;
}

export function TimeRangeSelector({
  value,
  onChange,
  disabled = false,
}: TimeRangeSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    const preset = TIME_RANGE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange(presetId, preset.defaultStep);
    }
  };

  return (
    <div>
      <label
        htmlFor="time-range"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        시간 범위
      </label>
      <select
        id="time-range"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {TIME_RANGE_PRESETS.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
