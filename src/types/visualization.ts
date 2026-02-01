/**
 * Visualization - 시각화 정보
 */

import type { EChartsOption } from 'echarts';

export type VisualizationType = 'line' | 'area' | 'bar' | 'stat' | 'table' | 'text';

export interface GridConfig {
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  containLabel?: boolean;
}

export interface AxisConfig {
  type?: 'category' | 'value' | 'time' | 'log';
  data?: (string | number)[];
  name?: string;
  axisLabel?: {
    formatter?: string | ((value: number | string, index: number) => string);
    rotate?: number;
  };
}

export interface SeriesConfig {
  name?: string;
  type: 'line' | 'bar' | 'scatter';
  data: (number | number[] | [number, number] | [string, number])[];
  smooth?: boolean;
  showSymbol?: boolean;
  areaStyle?: object;
  stack?: string;
}

export interface TableColumn {
  key: string;
  title: string;
  width?: number | string;
}

export interface ChartConfig {
  // Common
  grid?: GridConfig;
  tooltip?: EChartsOption['tooltip'];
  legend?: EChartsOption['legend'];

  // Line/Area/Bar
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  series?: SeriesConfig[];

  // Stat
  value?: number | string;
  unit?: string;

  // Table
  columns?: TableColumn[];
  rows?: Record<string, unknown>[];
}

export interface Visualization {
  type: VisualizationType;
  title?: string;
  config: ChartConfig;
}
