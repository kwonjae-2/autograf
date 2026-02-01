/**
 * Query Editor
 */

import { PromQLInput } from './PromQLInput';
import { TimeRangeSelector } from './TimeRangeSelector';
import { StepInput } from './StepInput';
import { getResolvedTimeRangeFromPreset } from '../../utils/timeRangeResolver';

interface QueryEditorProps {
  promql: string;
  timeRangePreset: string;
  step: string;
  onPromqlChange: (query: string) => void;
  onTimeRangeChange: (presetId: string, defaultStep: string) => void;
  onStepChange: (step: string) => void;
  onExecute: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function QueryEditor({
  promql,
  timeRangePreset,
  step,
  onPromqlChange,
  onTimeRangeChange,
  onStepChange,
  onExecute,
  isLoading = false,
  disabled = false,
}: QueryEditorProps) {
  const canExecute = !disabled && promql.trim() !== '';
  const resolvedTimeRange = getResolvedTimeRangeFromPreset(timeRangePreset);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canExecute && !isLoading) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="card" onKeyDown={handleKeyDown}>
      <div className="p-4 space-y-3">
        {/* Query Input */}
        <PromQLInput
          value={promql}
          onChange={onPromqlChange}
          disabled={isLoading || disabled}
        />

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <TimeRangeSelector
              value={timeRangePreset}
              onChange={onTimeRangeChange}
              disabled={isLoading || disabled}
            />
            <StepInput
              value={step}
              onChange={onStepChange}
              startTimestamp={resolvedTimeRange.start}
              endTimestamp={resolvedTimeRange.end}
              disabled={isLoading || disabled}
            />
          </div>

          <button
            onClick={onExecute}
            disabled={!canExecute || isLoading}
            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
