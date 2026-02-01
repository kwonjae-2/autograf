/**
 * PromQL Input
 */

interface PromQLInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PromQLInput({ value, onChange, disabled = false }: PromQLInputProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="Enter PromQL query... (e.g., up, rate(http_requests_total[5m]))"
      rows={2}
      className="input font-mono text-sm resize-none"
      spellCheck={false}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
    />
  );
}
