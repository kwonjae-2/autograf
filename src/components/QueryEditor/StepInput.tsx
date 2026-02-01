/**
 * Step Input Component with Validation
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
  const [error, setError] = useState<string | undefined>();
  const [warning, setWarning] = useState<string | undefined>();
  const [isCustom, setIsCustom] = useState(false);

  // Validate when value or time range changes
  useEffect(() => {
    if (startTimestamp && endTimestamp && value) {
      const result = validateStep(value, startTimestamp, endTimestamp);
      setError(result.error);
      setWarning(result.warning);
    } else {
      setError(undefined);
      setWarning(undefined);
    }
  }, [value, startTimestamp, endTimestamp]);

  // Check if current value is in preset options
  useEffect(() => {
    setIsCustom(!STEP_OPTIONS.includes(value));
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      onChange(selected);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label
        htmlFor="step-input"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Step
      </label>

      <div className="flex gap-2">
        <select
          id="step-preset"
          value={isCustom ? 'custom' : value}
          onChange={handleSelectChange}
          disabled={disabled}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {STEP_OPTIONS.map((step) => (
            <option key={step} value={step}>
              {step}
            </option>
          ))}
          <option value="custom">직접 입력</option>
        </select>

        {isCustom && (
          <input
            type="text"
            id="step-input"
            value={value}
            onChange={handleCustomChange}
            placeholder="예: 30s"
            disabled={disabled}
            className={`
              block w-24 px-3 py-2 border rounded-md shadow-sm text-sm
              focus:outline-none focus:ring-primary-500 focus:border-primary-500
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : 'border-gray-300'}
            `}
          />
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
      {warning && !error && (
        <p className="mt-1 text-xs text-yellow-600">{warning}</p>
      )}
    </div>
  );
}
