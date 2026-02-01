/**
 * QueryEditor Container Component
 */

import { PromQLInput } from './PromQLInput';
import { TimeRangeSelector } from './TimeRangeSelector';
import { StepInput } from './StepInput';
import { Button } from '../common';
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
  activeDataSourceName?: string;
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
  activeDataSourceName,
}: QueryEditorProps) {
  const canExecute = !disabled && promql.trim() !== '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canExecute && !isLoading) {
      e.preventDefault();
      onExecute();
    }
  };

  // Get resolved time range for step validation
  const resolvedTimeRange = getResolvedTimeRangeFromPreset(timeRangePreset);

  return (
    <div className="card p-6" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">쿼리 편집기</h2>
        {activeDataSourceName && (
          <span className="text-sm text-gray-500">
            연결: <span className="font-medium text-primary-600">{activeDataSourceName}</span>
          </span>
        )}
      </div>

      <div className="space-y-4">
        {disabled && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              쿼리를 실행하려면 먼저 데이터소스를 선택하세요.
            </p>
          </div>
        )}

        <PromQLInput
          value={promql}
          onChange={onPromqlChange}
          disabled={isLoading || disabled}
        />

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Ctrl + Enter로 실행
          </p>
          <Button
            onClick={onExecute}
            disabled={!canExecute}
            isLoading={isLoading}
          >
            {isLoading ? '실행 중...' : '실행'}
          </Button>
        </div>
      </div>
    </div>
  );
}
