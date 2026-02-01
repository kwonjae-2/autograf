/**
 * URL Input Component (MVP - temporary)
 */

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UrlInput({ value, onChange, disabled = false }: UrlInputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="prometheus-url"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Prometheus URL
      </label>
      <input
        type="url"
        id="prometheus-url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="https://prometheus.example.com"
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          placeholder-gray-400 text-sm
          focus:outline-none focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        autoComplete="url"
      />
      <p className="mt-1 text-xs text-gray-500">
        CORS가 허용된 Prometheus 서버 URL을 입력하세요
      </p>
    </div>
  );
}
