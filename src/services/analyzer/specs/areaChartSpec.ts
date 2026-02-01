/**
 * Area Chart Spec Generator (Stacked)
 */

import type { ChartConfig, MatrixResultData } from '../../../types';

/**
 * Generate ECharts stacked area chart configuration from matrix data
 */
export function generateAreaChartSpec(data: MatrixResultData): ChartConfig {
  const series = data.result.map((metric) => {
    const name = formatMetricName(metric.metric);
    const chartData = metric.values.map(([timestamp, value]) => [
      timestamp * 1000,
      parseFloat(value),
    ]);

    return {
      name,
      type: 'line' as const,
      data: chartData,
      smooth: true,
      showSymbol: false,
      stack: 'Total',
      areaStyle: {},
    };
  });

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
        type: 'cross',
      },
    },
    legend: {
      type: 'scroll',
      bottom: 0,
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: (value: number | string) => {
          const date = new Date(typeof value === 'number' ? value : parseInt(value, 10));
          return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        },
      },
    },
    yAxis: {
      type: 'value',
    },
    series,
  };
}

/**
 * Format metric labels into a display name
 */
function formatMetricName(metric: Record<string, string>): string {
  const name = metric['__name__'] ?? '';
  const labels = Object.entries(metric)
    .filter(([key]) => key !== '__name__')
    .map(([key, value]) => `${key}="${value}"`)
    .join(', ');

  if (name && labels) {
    return `${name}{${labels}}`;
  }
  if (name) {
    return name;
  }
  if (labels) {
    return `{${labels}}`;
  }
  return 'value';
}
