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

  // Render error based on type
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h1 className="text-xl font-bold text-gray-900">Autograf</h1>
            </div>
            <span className="text-sm text-gray-500">Prometheus 자동 시각화</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - DataSource Panel */}
          <aside className="lg:col-span-1">
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

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Query Editor */}
            <section>
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
                activeDataSourceName={activeDataSource?.name}
              />
            </section>

            {/* Results */}
            <section>
              {isLoading && (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              )}

              {error && !isLoading && renderError(error)}

              {data && !isLoading && !error && <VisualizationPanel result={data} />}

              {!data && !isLoading && !error && (
                <div className="text-center py-12 text-gray-500 card p-8">
                  {!activeDataSource ? (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                      <p className="font-medium">데이터소스를 추가해주세요</p>
                      <p className="text-sm mt-1">
                        왼쪽 패널에서 Prometheus 서버 연결 정보를 설정하세요
                      </p>
                    </>
                  ) : (
                    <>
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <p className="font-medium">PromQL 쿼리를 입력하고 실행하세요</p>
                      <p className="text-sm mt-1">
                        예: up, rate(http_requests_total[5m])
                      </p>
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            Autograf - 결정론적 자동 시각화 | 인증 정보는 브라우저에만 저장됩니다
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
