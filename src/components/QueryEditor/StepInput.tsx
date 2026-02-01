/**
 * Step Input
 */

import { useState, useEffect } from 'react';
import { STEP_OPTIONS, validateStep } from '../../utils/stepValidator';

interface StepInputProps {
  value: string;
  onChange: (step: string) => void;
  startTimestamp?: number;
  endTimestamp?: number;
  disabled?: boolean;
}

export function StepInput({
  value,
  onChange,
  startTimestamp,
  endTimestamp,
  disabled = false,
}: StepInputProps) {
  const [warning, setWarning] = useState<string | undefined>();

  useEffect(() => {
    if (startTimestamp && endTimestamp && value) {
      const result = validateStep(value, startTimestamp, endTimestamp);
      setWarning(result.warning);
    } else {
      setWarning(undefined);
    }
  }, [value, startTimestamp, endTimestamp]);

  return (
    <div className="relative">
      <select
        value={STEP_OPTIONS.includes(value) ? value : 'custom'}
        onChange={(e) => {
          if (e.target.value !== 'custom') {
            onChange(e.target.value);
          }
        }}
        disabled={disabled}
        className="input w-auto pr-8 appearance-none bg-no-repeat bg-right cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: '1.25rem',
          backgroundPosition: 'right 0.5rem center',
        }}
        title={warning}
      >
        {STEP_OPTIONS.map((step) => (
          <option key={step} value={step}>{step}</option>
        ))}
      </select>
      {warning && (
        <div className="absolute -bottom-1 left-0 w-2 h-2 rounded-full bg-amber-500" title={warning} />
      )}
    </div>
  );
}
