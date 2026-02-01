/**
 * DataSource Form
 */

import { useState } from 'react';
import type { DataSourceInput, AuthConfig } from '../../types';

interface DataSourceFormProps {
  initialValues?: {
    name: string;
    url: string;
    token?: string;
  };
  onSubmit: (input: DataSourceInput) => void;
  onCancel?: () => void;
  onTestConnection?: (url: string, auth: AuthConfig | null) => Promise<boolean>;
  isLoading?: boolean;
}

export function DataSourceForm({
  initialValues,
  onSubmit,
  onTestConnection,
  isLoading = false,
}: DataSourceFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [token, setToken] = useState(initialValues?.token ?? '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const auth: AuthConfig | null = token.trim() ? { type: 'bearer', token: token.trim() } : null;
    onSubmit({ name: name.trim(), url: url.trim(), auth });
  };

  const handleTest = async () => {
    if (!onTestConnection || !url.trim()) return;
    setIsTesting(true);
    setTestResult(null);
    const auth: AuthConfig | null = token.trim() ? { type: 'bearer', token: token.trim() } : null;
    try {
      const success = await onTestConnection(url.trim(), auth);
      setTestResult(success ? 'success' : 'error');
    } catch {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const isValid = name.trim() !== '' && url.trim() !== '';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Prometheus"
          className="input"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="label">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setTestResult(null); }}
          placeholder="https://prometheus.example.com"
          className="input"
          disabled={isLoading}
        />
        {onTestConnection && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleTest()}
              disabled={isTesting || !url.trim() || isLoading}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 disabled:cursor-not-allowed"
            >
              {isTesting ? 'Testing...' : 'Test connection'}
            </button>
            {testResult === 'success' && (
              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connected
              </span>
            )}
            {testResult === 'error' && (
              <span className="flex items-center gap-1 text-xs text-red-400">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Failed
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="label">Bearer Token <span className="text-slate-600">(optional)</span></label>
        <input
          type="password"
          value={token}
          onChange={(e) => { setToken(e.target.value); setTestResult(null); }}
          placeholder="••••••••"
          className="input"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
