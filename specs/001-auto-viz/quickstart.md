# Quickstart: PromQL 자동 시각화

**Feature**: 001-auto-viz  
**Date**: 2026-02-01  
**Status**: Complete

## Prerequisites

- **Node.js**: 20.x LTS 이상
- **pnpm**: 9.x 이상 (권장) 또는 npm/yarn
- **Git**: 최신 버전
- **IDE**: VS Code 권장 (ESLint, Prettier 확장)

---

## 1. Project Setup

### Initialize Project

```bash
# 프로젝트 루트에서 실행
pnpm create vite@latest . --template react-ts

# 또는 빈 디렉토리가 아닌 경우
pnpm create vite@latest frontend --template react-ts
cd frontend
```

### Install Dependencies

```bash
# Core dependencies
pnpm add react@18 react-dom@18
pnpm add echarts echarts-for-react
pnpm add @tanstack/react-query

# Styling
pnpm add -D tailwindcss postcss autoprefixer

# Dev dependencies
pnpm add -D typescript @types/react @types/react-dom
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
pnpm add -D eslint prettier eslint-config-prettier
```

### Configure Tailwind CSS

```bash
npx tailwindcss init -p
```

**tailwind.config.js**:
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**src/index.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure TypeScript

**tsconfig.json** (strict mode 필수 - 헌법 V):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 2. Directory Structure Setup

```bash
# Create directories
mkdir -p src/{components,services,types,hooks,utils}
mkdir -p src/components/{DataSource,QueryEditor,Visualization,common}
mkdir -p src/services/{prometheus,analyzer,storage}
mkdir -p tests/{unit,integration,snapshots}
mkdir -p tests/unit/{analyzer,services}
```

---

## 3. Initial Files

### src/types/index.ts

```typescript
// Re-export all types
export * from './datasource';
export * from './query';
export * from './result';
export * from './visualization';
export * from './state';
```

### src/types/datasource.ts

```typescript
export interface DataSource {
  id: string;
  name: string;
  url: string;
  auth: AuthConfig | null;
  status: ConnectionStatus;
  createdAt: number;
  updatedAt: number;
}

export interface AuthConfig {
  type: 'bearer';
  token: string;
}

export type ConnectionStatus = 'unknown' | 'connecting' | 'connected' | 'error';
```

### src/services/prometheus/client.ts

```typescript
import type { QueryResult } from '../../types';

export interface PrometheusClientConfig {
  baseUrl: string;
  auth?: { token: string } | null;
}

export async function queryRange(
  config: PrometheusClientConfig,
  expr: string,
  start: number,
  end: number,
  step: string
): Promise<QueryResult> {
  const url = new URL('/api/v1/query_range', config.baseUrl);
  url.searchParams.set('query', expr);
  url.searchParams.set('start', start.toString());
  url.searchParams.set('end', end.toString());
  url.searchParams.set('step', step);

  const headers: HeadersInit = { Accept: 'application/json' };
  if (config.auth?.token) {
    headers['Authorization'] = `Bearer ${config.auth.token}`;
  }

  const response = await fetch(url.toString(), { headers });
  return response.json();
}
```

### src/services/analyzer/selectVisualization.ts

```typescript
import type { QueryResult, VisualizationType } from '../../types';

/**
 * 쿼리 결과를 분석하여 적합한 시각화 타입을 선택한다.
 * 
 * 규칙:
 * - matrix (range vector): 시리즈 수에 따라 line/area/table
 * - vector (instant): 값 수에 따라 stat/bar/table
 * - scalar: stat
 * - string: text
 * 
 * @param result - Prometheus 쿼리 결과
 * @returns 선택된 시각화 타입
 */
export function selectVisualization(result: QueryResult): VisualizationType {
  if (result.status !== 'success' || !result.data) {
    throw new Error('Invalid query result');
  }

  const { resultType, result: data } = result.data;

  switch (resultType) {
    case 'matrix': {
      const seriesCount = data.length;
      if (seriesCount === 0) return 'table';
      if (seriesCount <= 10) return 'line';
      return 'area';
    }

    case 'vector': {
      const valueCount = data.length;
      if (valueCount === 0) return 'table';
      if (valueCount === 1) return 'stat';
      if (valueCount <= 5) return 'bar';
      return 'table';
    }

    case 'scalar':
      return 'stat';

    case 'string':
      return 'text';

    default:
      return 'table';
  }
}
```

---

## 4. Testing Setup

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
  },
});
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom/vitest';
```

### tests/unit/analyzer/selectVisualization.test.ts

```typescript
import { describe, it, expect } from 'vitest';
import { selectVisualization } from '../../../src/services/analyzer/selectVisualization';

describe('selectVisualization', () => {
  it('should return "line" for matrix with 1-10 series', () => {
    const result = {
      status: 'success' as const,
      data: {
        resultType: 'matrix' as const,
        result: [
          { metric: { job: 'test' }, values: [[1, '1']] },
        ],
      },
    };

    expect(selectVisualization(result)).toBe('line');
  });

  it('should return "stat" for single vector value', () => {
    const result = {
      status: 'success' as const,
      data: {
        resultType: 'vector' as const,
        result: [
          { metric: { job: 'test' }, value: [1, '42'] },
        ],
      },
    };

    expect(selectVisualization(result)).toBe('stat');
  });

  it('should return "stat" for scalar', () => {
    const result = {
      status: 'success' as const,
      data: {
        resultType: 'scalar' as const,
        result: [1, '42'],
      },
    };

    expect(selectVisualization(result)).toBe('stat');
  });
});
```

---

## 5. Development Workflow

### Start Development Server

```bash
pnpm dev
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run with coverage
pnpm test -- --coverage
```

### Build for Production

```bash
pnpm build
```

빌드 결과물은 `dist/` 디렉토리에 생성된다.

### Preview Production Build

```bash
pnpm preview
```

---

## 6. Deployment (GitHub Pages)

### GitHub Actions Workflow

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Vite Base Path Configuration

**vite.config.ts** (GitHub Pages 하위 경로 배포 시):
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/autograf/', // GitHub repo name
});
```

---

## 7. Verification Checklist

프로젝트 설정 완료 후 확인:

- [ ] `pnpm dev` 실행 시 브라우저에서 앱 로드됨
- [ ] TypeScript strict mode 에러 없음
- [ ] `pnpm test` 실행 시 테스트 통과
- [ ] `pnpm build` 실행 시 `dist/` 디렉토리 생성됨
- [ ] `dist/` 디렉토리에 `index.html`, `assets/` 존재
- [ ] ESLint 에러 없음 (`pnpm lint`)

---

## 8. Constitution Compliance Verification

| 원칙 | 검증 방법 |
|------|-----------|
| I. Static Client-Only | `dist/` 디렉토리에 정적 파일만 존재 |
| II. Deterministic | `selectVisualization` 단위 테스트 통과 |
| III. Local-Only Security | LocalStorage 사용, 외부 API 호출 없음 확인 |
| IV. Explicit Error | 모든 catch 블록에서 에러 UI 표시 확인 |
| V. Code Quality | TypeScript strict mode, ESLint 통과 |
