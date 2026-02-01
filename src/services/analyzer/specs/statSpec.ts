/**
 * Stat Display Spec Generator
 */

import type { ChartConfig, ResultData, VectorResultData, ScalarResultData } from '../../../types';

/**
 * Generate stat display configuration
 */
export function generateStatSpec(data: ResultData): ChartConfig {
  let value: number | string;
  let unit = '';

  switch (data.resultType) {
    case 'scalar':
      value = formatValue(parseFloat((data as ScalarResultData).result[1]));
      break;
    case 'vector':
      if (data.result.length > 0) {
        value = formatValue(parseFloat((data as VectorResultData).result[0]!.value[1]));
      } else {
        value = 'N/A';
      }
      break;
    default:
      value = 'N/A';
  }

  return {
    value,
    unit,
  };
}

/**
 * Format numeric value for display
 */
function formatValue(value: number): string {
  if (isNaN(value)) {
    return 'NaN';
  }
  if (!isFinite(value)) {
    return value > 0 ? '+Inf' : '-Inf';
  }

  // Format large numbers
  if (Math.abs(value) >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }

  // Format decimal numbers
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2);
}
