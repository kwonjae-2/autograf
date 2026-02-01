/**
 * Table Spec Generator
 */

import type { ChartConfig, ResultData, VectorResultData, MatrixResultData, TableColumn } from '../../../types';

/**
 * Generate table configuration from result data
 */
export function generateTableSpec(data: ResultData): ChartConfig {
  switch (data.resultType) {
    case 'vector':
      return generateVectorTableSpec(data as VectorResultData);
    case 'matrix':
      return generateMatrixTableSpec(data as MatrixResultData);
    default:
      return { columns: [], rows: [] };
  }
}

/**
 * Generate table spec for vector data
 */
function generateVectorTableSpec(data: VectorResultData): ChartConfig {
  // Collect all unique label keys
  const labelKeys = new Set<string>();
  data.result.forEach((metric) => {
    Object.keys(metric.metric).forEach((key) => {
      if (key !== '__name__') {
        labelKeys.add(key);
      }
    });
  });

  // Build columns
  const columns: TableColumn[] = [
    { key: '__name__', title: 'Metric', width: 150 },
    ...Array.from(labelKeys).map((key) => ({
      key,
      title: key,
      width: 120,
    })),
    { key: 'value', title: 'Value', width: 100 },
    { key: 'timestamp', title: 'Timestamp', width: 180 },
  ];

  // Build rows
  const rows = data.result.map((metric, index) => {
    const row: Record<string, unknown> = {
      __key: index,
      __name__: metric.metric['__name__'] ?? '',
      value: parseFloat(metric.value[1]).toFixed(4),
      timestamp: new Date(metric.value[0] * 1000).toISOString(),
    };

    labelKeys.forEach((key) => {
      row[key] = metric.metric[key] ?? '';
    });

    return row;
  });

  return { columns, rows };
}

/**
 * Generate table spec for matrix data (latest values only)
 */
function generateMatrixTableSpec(data: MatrixResultData): ChartConfig {
  // Collect all unique label keys
  const labelKeys = new Set<string>();
  data.result.forEach((metric) => {
    Object.keys(metric.metric).forEach((key) => {
      if (key !== '__name__') {
        labelKeys.add(key);
      }
    });
  });

  // Build columns
  const columns: TableColumn[] = [
    { key: '__name__', title: 'Metric', width: 150 },
    ...Array.from(labelKeys).map((key) => ({
      key,
      title: key,
      width: 120,
    })),
    { key: 'latest_value', title: 'Latest Value', width: 100 },
    { key: 'data_points', title: 'Data Points', width: 100 },
  ];

  // Build rows (using latest value from each series)
  const rows = data.result.map((metric, index) => {
    const latestValue = metric.values[metric.values.length - 1];
    const row: Record<string, unknown> = {
      __key: index,
      __name__: metric.metric['__name__'] ?? '',
      latest_value: latestValue ? parseFloat(latestValue[1]).toFixed(4) : 'N/A',
      data_points: metric.values.length,
    };

    labelKeys.forEach((key) => {
      row[key] = metric.metric[key] ?? '';
    });

    return row;
  });

  return { columns, rows };
}
