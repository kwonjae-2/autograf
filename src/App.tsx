import { useState } from 'react';
import { QueryEditor } from './components/QueryEditor';
import { VisualizationPanel } from './components/Visualization';
import { LoadingSpinner, ErrorDisplay } from './components/common';
import { usePrometheusQuery } from './hooks/usePrometheusQuery';

function App() {
  const [prometheusUrl, setPrometheusUrl] = useState('');
  const [promql, setPromql] = useState('');

  const { data, error, isLoading, execute } = usePrometheusQuery();

  const handleExecute = () => {
    if (prometheusUrl && promql) {
      execute({ url: prometheusUrl, query: promql });
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
        {/* Query Editor */}
        <section className="mb-8">
          <QueryEditor
            prometheusUrl={prometheusUrl}
            promql={promql}
            onUrlChange={setPrometheusUrl}
            onPromqlChange={setPromql}
            onExecute={handleExecute}
            isLoading={isLoading}
          />
        </section>

        {/* Results */}
        <section>
          {isLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && !isLoading && <ErrorDisplay error={error} />}

          {data && !isLoading && !error && <VisualizationPanel result={data} />}

          {!data && !isLoading && !error && (
            <div className="text-center py-12 text-gray-500">
              <p>Prometheus URL과 PromQL을 입력하고 실행하세요.</p>
            </div>
          )}
        </section>
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
