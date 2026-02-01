/**
 * PromQL Input Component
 */

interface PromQLInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function PromQLInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'up',
}: PromQLInputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor="promql-input"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        PromQL 쿼리
      </label>
      <textarea
        id="promql-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className={`
          block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          placeholder-gray-400 font-mono text-sm
          focus:outline-none focus:ring-primary-500 focus:border-primary-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          resize-y min-h-[80px]
        `}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      <p className="mt-1 text-xs text-gray-500">
        예: up, rate(http_requests_total[5m]), sum by (job) (process_cpu_seconds_total)
      </p>
    </div>
  );
}
