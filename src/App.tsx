import { useState } from 'react';
import { QueryEditor } from './components/QueryEditor';
import { VisualizationPanel } from './components/Visualization';
import { DataSourcePanel } from './components/DataSource';
import {
  LoadingSpinner,
  ErrorDisplay,
  ConnectionErrorDisplay,
  QueryErrorDisplay,
  TimeoutErrorDisplay,
} from './components/common';
import { usePrometheusQuery } from './hooks/usePrometheusQuery';
import { useDataSources } from './hooks/useDataSources';
import { getResolvedTimeRangeFromPreset } from './utils/timeRangeResolver';
import { DEFAULT_PRESET_ID, getDefaultPreset } from './utils/timeRangePresets';
import type { AppError } from './types';

function App() {
  const [promql, setPromql] = useState('');
  const [timeRangePreset, setTimeRangePreset] = useState(DEFAULT_PRESET_ID);
  const [step, setStep] = useState(getDefaultPreset().defaultStep);

  const {
    dataSources,
    activeDataSource,
    setActiveDataSource,
    addDataSource,
    editDataSource,
    removeDataSource,
    testConnection,
  } = useDataSources();

  const { data, error, isLoading, execute, retry } = usePrometheusQuery();

  const handleTimeRangeChange = (presetId: string, defaultStep: string) => {
    setTimeRangePreset(presetId);
    setStep(defaultStep);
  };

  const handleExecute = () => {
    if (activeDataSource && promql) {
      const { start, end } = getResolvedTimeRangeFromPreset(timeRangePreset);
      execute({
        url: activeDataSource.url,
        query: promql,
        auth: activeDataSource.auth,
        start,
        end,
        step,
      });
    }
  };

  const renderError = (err: AppError) => {
    switch (err.type) {
      case 'connection':
      case 'cors':
        return <ConnectionErrorDisplay error={err} onRetry={retry} />;
      case 'query':
        return <QueryErrorDisplay error={err} />;
      case 'timeout':
        return <TimeoutErrorDisplay error={err} onRetry={retry} />;
      case 'auth':
        return <ConnectionErrorDisplay error={err} />;
      default:
        return <ErrorDisplay error={err} onRetry={retry} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="h-full max-w-[1800px] mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white">Autograf</span>
          </div>
          {activeDataSource && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400">{activeDataSource.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto p-4 flex gap-4">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <DataSourcePanel
            dataSources={dataSources}
            activeDataSource={activeDataSource}
            onSelect={setActiveDataSource}
            onAdd={addDataSource}
            onEdit={editDataSource}
            onDelete={removeDataSource}
            onTestConnection={testConnection}
          />
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <QueryEditor
            promql={promql}
            timeRangePreset={timeRangePreset}
            step={step}
            onPromqlChange={setPromql}
            onTimeRangeChange={handleTimeRangeChange}
            onStepChange={setStep}
            onExecute={handleExecute}
            isLoading={isLoading}
            disabled={!activeDataSource}
          />

          <div className="flex-1">
            {isLoading && (
              <div className="h-96 flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {error && !isLoading && renderError(error)}

            {data && !isLoading && !error && <VisualizationPanel result={data} />}

            {!data && !isLoading && !error && (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">
                    {!activeDataSource ? '데이터소스를 추가하세요' : 'PromQL을 입력하고 실행하세요'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
