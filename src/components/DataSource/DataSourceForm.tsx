/**
 * DataSource Form Component
 * URL 및 인증 토큰 입력 폼
 */

import { useState } from 'react';
import type { DataSourceInput, AuthConfig } from '../../types';
import { Button, Input } from '../common';

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
  submitLabel?: string;
}

export function DataSourceForm({
  initialValues,
  onSubmit,
  onCancel,
  onTestConnection,
  isLoading = false,
  submitLabel = '저장',
}: DataSourceFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [token, setToken] = useState(initialValues?.token ?? '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const auth: AuthConfig | null = token.trim()
      ? { type: 'bearer', token: token.trim() }
      : null;

    onSubmit({
      name: name.trim(),
      url: url.trim(),
      auth,
    });
  };

  const handleTestConnection = async () => {
    if (!onTestConnection || !url.trim()) return;

    setIsTesting(true);
    setTestResult(null);

    const auth: AuthConfig | null = token.trim()
      ? { type: 'bearer', token: token.trim() }
      : null;

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
      <Input
        label="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Production Prometheus"
        disabled={isLoading}
        required
      />

      <div className="space-y-2">
        <Input
          label="Prometheus URL"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setTestResult(null);
          }}
          placeholder="https://prometheus.example.com"
          disabled={isLoading}
          required
        />
        
        {onTestConnection && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleTestConnection()}
              disabled={isTesting || !url.trim() || isLoading}
              className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? '테스트 중...' : '연결 테스트'}
            </button>
            {testResult === 'success' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                연결 성공
              </span>
            )}
            {testResult === 'error' && (
              <span className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                연결 실패
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <Input
          label="Bearer Token (선택)"
          type="password"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setTestResult(null);
          }}
          placeholder="인증이 필요한 경우 입력"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          토큰은 브라우저 로컬 스토리지에만 저장됩니다
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
        )}
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
