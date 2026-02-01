/**
 * QueryEditor Container Component
 */

import { UrlInput } from './UrlInput';
import { PromQLInput } from './PromQLInput';
import { Button } from '../common';

interface QueryEditorProps {
  prometheusUrl: string;
  promql: string;
  onUrlChange: (url: string) => void;
  onPromqlChange: (query: string) => void;
  onExecute: () => void;
  isLoading?: boolean;
}

export function QueryEditor({
  prometheusUrl,
  promql,
  onUrlChange,
  onPromqlChange,
  onExecute,
  isLoading = false,
}: QueryEditorProps) {
  const canExecute = prometheusUrl.trim() !== '' && promql.trim() !== '';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && canExecute && !isLoading) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div className="card p-6" onKeyDown={handleKeyDown}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">쿼리 편집기</h2>
      
      <div className="space-y-4">
        <UrlInput
          value={prometheusUrl}
          onChange={onUrlChange}
          disabled={isLoading}
        />

        <PromQLInput
          value={promql}
          onChange={onPromqlChange}
          disabled={isLoading}
        />

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
