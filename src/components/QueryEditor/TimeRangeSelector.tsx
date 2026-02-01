/**
 * Time Range Selector
 */

import { TIME_RANGE_PRESETS } from '../../utils/timeRangePresets';

interface TimeRangeSelectorProps {
  value: string;
  onChange: (presetId: string, defaultStep: string) => void;
  disabled?: boolean;
}

export function TimeRangeSelector({ value, onChange, disabled = false }: TimeRangeSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    const preset = TIME_RANGE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange(presetId, preset.defaultStep);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className="input w-auto pr-8 appearance-none bg-no-repeat bg-right cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundSize: '1.25rem',
        backgroundPosition: 'right 0.5rem center',
      }}
    >
      {TIME_RANGE_PRESETS.map((preset) => (
        <option key={preset.id} value={preset.id}>
          {preset.label}
        </option>
      ))}
    </select>
  );
}
