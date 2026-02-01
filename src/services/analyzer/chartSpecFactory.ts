/**
 * Chart Spec Factory
 * 데이터와 시각화 타입에 따라 적절한 차트 스펙을 생성합니다.
 */

import type { ResultData, VisualizationType, ChartConfig } from '../../types';
import { isMatrixResult, isVectorResult } from '../../types';
import { generateLineChartSpec } from './specs/lineChartSpec';
import { generateAreaChartSpec } from './specs/areaChartSpec';
import { generateBarChartSpec } from './specs/barChartSpec';
import { generateStatSpec } from './specs/statSpec';
import { generateTableSpec } from './specs/tableSpec';

/**
 * Create chart configuration based on visualization type and data
 */
export function createChartSpec(
  type: VisualizationType,
  data: ResultData
): ChartConfig {
  switch (type) {
    case 'line':
      if (isMatrixResult(data)) {
        return generateLineChartSpec(data);
      }
      return generateTableSpec(data);

    case 'area':
      if (isMatrixResult(data)) {
        return generateAreaChartSpec(data);
      }
      return generateTableSpec(data);

    case 'bar':
      if (isVectorResult(data)) {
        return generateBarChartSpec(data);
      }
      return generateTableSpec(data);

    case 'stat':
      return generateStatSpec(data);

    case 'table':
      return generateTableSpec(data);

    case 'text':
      if (data.resultType === 'string') {
        return {
          value: data.result[1],
        };
      }
      return {
        value: 'N/A',
      };

    default:
      return generateTableSpec(data);
  }
}
