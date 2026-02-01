/**
 * ECharts Wrapper
 */

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig } from '../../types';

interface ChartProps {
  config: ChartConfig;
  height?: number | string;
}

export function Chart({ config, height = 400 }: ChartProps) {
  const option: EChartsOption = {
    backgroundColor: 'transparent',
    grid: {
      left: 50,
      right: 20,
      top: 20,
      bottom: 40,
      ...config.grid,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { type: 'cross', lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
      ...config.tooltip,
    },
    legend: {
      show: (config.series?.length ?? 0) > 1 && (config.series?.length ?? 0) <= 10,
      bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 11 },
      pageTextStyle: { color: '#94a3b8' },
      ...config.legend,
    },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { show: false },
      ...config.xAxis,
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#64748b', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1e293b' } },
      ...config.yAxis,
    },
    series: config.series?.map((s, i) => ({
      ...s,
      lineStyle: { width: 1.5 },
      itemStyle: { color: getSeriesColor(i) },
      areaStyle: s.areaStyle ? { opacity: 0.3 } : undefined,
    })),
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
    />
  );
}

const COLORS = [
  '#6366f1', '#22d3ee', '#a78bfa', '#34d399', '#fbbf24',
  '#f472b6', '#fb7185', '#38bdf8', '#4ade80', '#facc15',
];

function getSeriesColor(index: number): string {
  return COLORS[index % COLORS.length] ?? COLORS[0]!;
}
