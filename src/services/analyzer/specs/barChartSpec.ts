/**
 * Bar Chart Spec Generator
 */

import type { ChartConfig, VectorResultData } from '../../../types';

/**
 * Generate ECharts bar chart configuration from vector data
 */
export function generateBarChartSpec(data: VectorResultData): ChartConfig {
  const labels = data.result.map((metric) => formatMetricName(metric.metric));
  const values = data.result.map((metric) => parseFloat(metric.value[1]));

  return {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        rotate: labels.length > 3 ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: values,
      },
    ],
  };
}

/**
 * Format metric labels into a display name
 */
function formatMetricName(metric: Record<string, string>): string {
  const name = metric['__name__'] ?? '';
  const instance = metric['instance'] ?? '';
  const job = metric['job'] ?? '';

  if (instance) {
    return instance;
  }
  if (job) {
    return job;
  }
  if (name) {
    return name;
  }

  const firstLabel = Object.entries(metric).find(([key]) => key !== '__name__');
  return firstLabel ? firstLabel[1] : 'value';
}
