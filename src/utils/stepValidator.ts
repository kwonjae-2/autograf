/**
 * Step Validator
 * 데이터 포인트 수 경고 및 step 유효성 검사
 */

export interface StepValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  estimatedDataPoints?: number;
}

// Maximum recommended data points
const MAX_RECOMMENDED_POINTS = 10000;
const MAX_ALLOWED_POINTS = 50000;

/**
 * Parse step string to seconds
 */
export function parseStepToSeconds(step: string): number | null {
  const match = step.match(/^(\d+)([smhd])$/);
  if (!match) {
    return null;
  }

  const value = parseInt(match[1]!, 10);
  const unit = match[2]!;

  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
  };

  return value * (multipliers[unit] ?? 1);
}

/**
 * Validate step and estimate data points
 */
export function validateStep(
  step: string,
  startTimestamp: number,
  endTimestamp: number
): StepValidationResult {
  // Check step format
  if (!step.match(/^\d+[smhd]$/)) {
    return {
      isValid: false,
      error: 'step 형식이 올바르지 않습니다. 예: 15s, 1m, 1h',
    };
  }

  const stepSeconds = parseStepToSeconds(step);
  if (stepSeconds === null || stepSeconds <= 0) {
    return {
      isValid: false,
      error: 'step 값은 양수여야 합니다.',
    };
  }

  // Estimate data points
  const duration = endTimestamp - startTimestamp;
  const estimatedDataPoints = Math.ceil(duration / stepSeconds);

  // Check if exceeds maximum
  if (estimatedDataPoints > MAX_ALLOWED_POINTS) {
    return {
      isValid: false,
      error: `예상 데이터 포인트(${estimatedDataPoints.toLocaleString()}개)가 너무 많습니다. step을 늘려주세요.`,
      estimatedDataPoints,
    };
  }

  // Warning for large datasets
  if (estimatedDataPoints > MAX_RECOMMENDED_POINTS) {
    return {
      isValid: true,
      warning: `예상 데이터 포인트가 ${estimatedDataPoints.toLocaleString()}개입니다. 성능 저하가 발생할 수 있습니다.`,
      estimatedDataPoints,
    };
  }

  return {
    isValid: true,
    estimatedDataPoints,
  };
}

/**
 * Suggest optimal step for given time range
 */
export function suggestStep(startTimestamp: number, endTimestamp: number): string {
  const duration = endTimestamp - startTimestamp;

  // Target around 1000 data points
  const targetPoints = 1000;
  const stepSeconds = Math.ceil(duration / targetPoints);

  // Round to nice values
  if (stepSeconds <= 15) return '15s';
  if (stepSeconds <= 30) return '30s';
  if (stepSeconds <= 60) return '1m';
  if (stepSeconds <= 120) return '2m';
  if (stepSeconds <= 300) return '5m';
  if (stepSeconds <= 600) return '10m';
  if (stepSeconds <= 1800) return '30m';
  if (stepSeconds <= 3600) return '1h';
  if (stepSeconds <= 7200) return '2h';
  if (stepSeconds <= 21600) return '6h';
  if (stepSeconds <= 43200) return '12h';
  return '1d';
}

/**
 * Common step options
 */
export const STEP_OPTIONS = [
  '15s',
  '30s',
  '1m',
  '2m',
  '5m',
  '10m',
  '30m',
  '1h',
  '2h',
  '6h',
  '12h',
  '1d',
];
