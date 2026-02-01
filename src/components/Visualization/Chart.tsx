/**
 * ECharts Wrapper Component
 */

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ChartConfig } from '../../types';

interface ChartProps {
  config: ChartConfig;
  height?: number | string;
  className?: string;
}

export function Chart({ config, height = 400, className = '' }: ChartProps) {
  const option: EChartsOption = {
    grid: config.grid,
    tooltip: config.tooltip,
    legend: config.legend,
    xAxis: config.xAxis,
    yAxis: config.yAxis,
    series: config.series,
  };

  return (
    <div className={className}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge={true}
      />
    </div>
  );
}
