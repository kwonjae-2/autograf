/**
 * Visualization Selector Tests
 * 결정론적 동작 검증
 */

import { describe, it, expect } from 'vitest';
import { selectVisualization, getVisualizationRecommendation } from '../../../src/services/analyzer/visualizationSelector';
import type { MatrixResultData, VectorResultData, ScalarResultData, StringResultData } from '../../../src/types';

describe('selectVisualization', () => {
  describe('matrix (time series) data', () => {
    it('should return "line" for 1-10 series', () => {
      const data: MatrixResultData = {
        resultType: 'matrix',
        result: [
          { metric: { __name__: 'up', job: 'test' }, values: [[1, '1']] },
        ],
      };
      expect(selectVisualization(data)).toBe('line');
    });

    it('should return "line" for exactly 10 series', () => {
      const data: MatrixResultData = {
        resultType: 'matrix',
        result: Array.from({ length: 10 }, (_, i) => ({
          metric: { __name__: 'metric', instance: `instance-${i}` },
          values: [[1, '1']],
        })),
      };
      expect(selectVisualization(data)).toBe('line');
    });

    it('should return "area" for 11+ series', () => {
      const data: MatrixResultData = {
        resultType: 'matrix',
        result: Array.from({ length: 11 }, (_, i) => ({
          metric: { __name__: 'metric', instance: `instance-${i}` },
          values: [[1, '1']],
        })),
      };
      expect(selectVisualization(data)).toBe('area');
    });

    it('should return "table" for empty matrix', () => {
      const data: MatrixResultData = {
        resultType: 'matrix',
        result: [],
      };
      expect(selectVisualization(data)).toBe('table');
    });
  });

  describe('vector (instant) data', () => {
    it('should return "stat" for single value', () => {
      const data: VectorResultData = {
        resultType: 'vector',
        result: [
          { metric: { __name__: 'up' }, value: [1, '1'] },
        ],
      };
      expect(selectVisualization(data)).toBe('stat');
    });

    it('should return "bar" for 2-5 values', () => {
      const data: VectorResultData = {
        resultType: 'vector',
        result: [
          { metric: { instance: 'a' }, value: [1, '1'] },
          { metric: { instance: 'b' }, value: [1, '2'] },
          { metric: { instance: 'c' }, value: [1, '3'] },
        ],
      };
      expect(selectVisualization(data)).toBe('bar');
    });

    it('should return "table" for 6+ values', () => {
      const data: VectorResultData = {
        resultType: 'vector',
        result: Array.from({ length: 6 }, (_, i) => ({
          metric: { instance: `instance-${i}` },
          value: [1, String(i)] as [number, string],
        })),
      };
      expect(selectVisualization(data)).toBe('table');
    });

    it('should return "table" for empty vector', () => {
      const data: VectorResultData = {
        resultType: 'vector',
        result: [],
      };
      expect(selectVisualization(data)).toBe('table');
    });
  });

  describe('scalar data', () => {
    it('should return "stat" for scalar', () => {
      const data: ScalarResultData = {
        resultType: 'scalar',
        result: [1, '42'],
      };
      expect(selectVisualization(data)).toBe('stat');
    });
  });

  describe('string data', () => {
    it('should return "text" for string', () => {
      const data: StringResultData = {
        resultType: 'string',
        result: [1, 'hello'],
      };
      expect(selectVisualization(data)).toBe('text');
    });
  });

  describe('determinism', () => {
    it('should always return the same result for the same input', () => {
      const data: MatrixResultData = {
        resultType: 'matrix',
        result: [
          { metric: { __name__: 'up', job: 'test' }, values: [[1, '1'], [2, '1']] },
          { metric: { __name__: 'up', job: 'test2' }, values: [[1, '0'], [2, '1']] },
        ],
      };

      // Run multiple times
      const results = Array.from({ length: 100 }, () => selectVisualization(data));

      // All results should be identical
      expect(new Set(results).size).toBe(1);
      expect(results[0]).toBe('line');
    });
  });
});

describe('getVisualizationRecommendation', () => {
  it('should include reason for line chart', () => {
    const data: MatrixResultData = {
      resultType: 'matrix',
      result: [{ metric: { job: 'test' }, values: [[1, '1']] }],
    };

    const { type, reason } = getVisualizationRecommendation(data);
    expect(type).toBe('line');
    expect(reason).toContain('시계열');
    expect(reason).toContain('라인 차트');
  });

  it('should include reason for stat display', () => {
    const data: ScalarResultData = {
      resultType: 'scalar',
      result: [1, '42'],
    };

    const { type, reason } = getVisualizationRecommendation(data);
    expect(type).toBe('stat');
    expect(reason).toContain('통계 패널');
  });
});
