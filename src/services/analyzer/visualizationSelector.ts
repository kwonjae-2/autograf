/**
 * Visualization Selector
 * 규칙 기반 결정론적 시각화 타입 선택
 * 
 * 규칙:
 * - matrix (range vector):
 *   - 1-10 시리즈: line
 *   - 11+ 시리즈: area (stacked)
 * - vector (instant):
 *   - 1 값: stat
 *   - 2-5 값: bar
 *   - 6+ 값: table
 * - scalar: stat
 * - string: text
 */

import type { ResultData, VisualizationType } from '../../types';
import { countSeries } from './seriesAnalyzer';

/**
 * Select the most appropriate visualization type for the given data.
 * This is a DETERMINISTIC function - same input always produces same output.
 */
export function selectVisualization(data: ResultData): VisualizationType {
  switch (data.resultType) {
    case 'matrix':
      return selectMatrixVisualization(data.result.length);

    case 'vector':
      return selectVectorVisualization(data.result.length);

    case 'scalar':
      return 'stat';

    case 'string':
      return 'text';
  }
}

/**
 * Select visualization for matrix (time series) data
 */
function selectMatrixVisualization(seriesCount: number): VisualizationType {
  if (seriesCount === 0) {
    return 'table'; // Empty result
  }
  if (seriesCount <= 10) {
    return 'line';
  }
  return 'area'; // Stacked area for many series
}

/**
 * Select visualization for vector (instant) data
 */
function selectVectorVisualization(valueCount: number): VisualizationType {
  if (valueCount === 0) {
    return 'table'; // Empty result
  }
  if (valueCount === 1) {
    return 'stat';
  }
  if (valueCount <= 5) {
    return 'bar';
  }
  return 'table';
}

/**
 * Get visualization recommendation with reasoning
 */
export function getVisualizationRecommendation(data: ResultData): {
  type: VisualizationType;
  reason: string;
} {
  const type = selectVisualization(data);
  const seriesCount = countSeries(data);

  let reason: string;

  switch (data.resultType) {
    case 'matrix':
      if (seriesCount === 0) {
        reason = '결과가 비어 있어 테이블로 표시합니다.';
      } else if (seriesCount <= 10) {
        reason = `${seriesCount}개의 시계열 데이터를 라인 차트로 표시합니다.`;
      } else {
        reason = `${seriesCount}개의 시계열 데이터를 스택 영역 차트로 표시합니다.`;
      }
      break;

    case 'vector':
      if (seriesCount === 0) {
        reason = '결과가 비어 있어 테이블로 표시합니다.';
      } else if (seriesCount === 1) {
        reason = '단일 값을 통계 패널로 표시합니다.';
      } else if (seriesCount <= 5) {
        reason = `${seriesCount}개의 값을 바 차트로 표시합니다.`;
      } else {
        reason = `${seriesCount}개의 값을 테이블로 표시합니다.`;
      }
      break;

    case 'scalar':
      reason = '스칼라 값을 통계 패널로 표시합니다.';
      break;

    case 'string':
      reason = '문자열 값을 텍스트로 표시합니다.';
      break;
  }

  return { type, reason };
}
