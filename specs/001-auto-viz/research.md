# Research: PromQL 자동 시각화

**Feature**: 001-auto-viz  
**Date**: 2026-02-01  
**Status**: Complete

## 1. Framework & Build Tool 선택

### Decision: React 18 + Vite 5

**Rationale**:
- **React 18**: 가장 널리 사용되는 SPA 프레임워크, 풍부한 생태계
- **Vite**: 빠른 개발 서버, 최적화된 프로덕션 빌드, 정적 파일 출력

**Alternatives Considered**:
| 옵션 | 장점 | 탈락 사유 |
|------|------|-----------|
| Vue 3 + Vite | 학습 곡선 낮음 | React 생태계가 더 풍부 |
| Svelte + SvelteKit | 번들 크기 작음 | 차트 라이브러리 통합 사례 적음 |
| Vanilla JS | 의존성 없음 | 복잡한 상태 관리 어려움 |

**헌법 준수**: ✅ 정적 빌드 출력 (헌법 I)

---

## 2. 차트 라이브러리 선택

### Decision: Apache ECharts 5

**Rationale**:
- **JSON 기반 옵션**: 선언적 차트 구성, 결정론적 렌더링에 적합
- **다양한 차트 타입**: Line, Bar, Scatter, Heatmap, Gauge 등
- **대용량 데이터 지원**: Canvas 기반, 10,000+ 데이터 포인트 처리 가능
- **TypeScript 지원**: 완전한 타입 정의 제공

**Alternatives Considered**:
| 옵션 | 장점 | 탈락 사유 |
|------|------|-----------|
| Chart.js | 가벼움, 간단함 | 복잡한 시각화 제한적 |
| D3.js | 완전한 제어 | 학습 곡선 높음, 선언적이지 않음 |
| Recharts | React 친화적 | 대용량 데이터 성능 이슈 |
| Plotly.js | 다양한 차트 | 번들 크기 큼 |

**헌법 준수**: ✅ JSON 스펙 기반 → 결정론적 출력 (헌법 II)

---

## 3. 상태 관리 & 데이터 페칭

### Decision: TanStack Query (React Query) + React Context

**Rationale**:
- **TanStack Query**: 서버 상태(Prometheus API 응답) 관리에 최적화
  - 캐싱, 재시도, 로딩/에러 상태 자동 관리
  - 선언적 데이터 페칭
- **React Context**: 클라이언트 상태(데이터소스 설정) 관리
  - 간단한 상태에 충분
  - 외부 라이브러리 불필요

**Alternatives Considered**:
| 옵션 | 장점 | 탈락 사유 |
|------|------|-----------|
| Redux Toolkit | 예측 가능한 상태 | 이 규모에 과도함 |
| Zustand | 간단함 | TanStack Query와 역할 중복 |
| Jotai | 원자적 상태 | 학습 곡선 |

**헌법 준수**: ✅ 명시적 상태 관리, 예측 가능한 동작 (헌법 V)

---

## 4. Prometheus API 통합

### Decision: Fetch API + 커스텀 클라이언트

**Rationale**:
- **Fetch API**: 브라우저 내장, 추가 의존성 불필요
- **커스텀 래퍼**: 인증 헤더 주입, 에러 정규화, 타입 안전성

**API 엔드포인트**:
| 엔드포인트 | 용도 | 파라미터 |
|------------|------|----------|
| `GET /api/v1/query` | Instant Query | `query`, `time` |
| `GET /api/v1/query_range` | Range Query | `query`, `start`, `end`, `step` |
| `GET /api/v1/labels` | 연결 테스트용 | - |

**CORS 고려사항**:
- Prometheus 서버에서 CORS 허용 필요
- 또는 사용자가 프록시를 통해 접근
- CORS 오류 시 명확한 가이드 제공

**헌법 준수**: ✅ 클라이언트 직접 호출 (헌법 I), 인증 정보 로컬 저장 (헌법 III)

---

## 5. 시각화 선택 로직

### Decision: 규칙 기반 결정 트리

**Rationale**:
- **결정론적**: 동일 입력 → 동일 출력
- **테스트 가능**: 순수 함수로 구현
- **명시적**: 코드에서 규칙이 명확히 보임

**시각화 선택 규칙**:

```
1. resultType 확인
   ├── "matrix" (Range Vector)
   │   ├── 시리즈 1개 → Line Chart
   │   ├── 시리즈 2-10개 → Multi-Line Chart
   │   └── 시리즈 11개 이상 → Stacked Area 또는 Table
   │
   ├── "vector" (Instant Vector)
   │   ├── 값 1개 → Single Stat
   │   ├── 값 2-5개 → Bar Chart (horizontal)
   │   └── 값 6개 이상 → Table
   │
   ├── "scalar" → Single Stat (숫자 표시)
   │
   └── "string" → Text Display
```

**추가 규칙**:
- 시계열 데이터가 있으면 X축에 시간
- 레이블이 있으면 범례에 표시
- 값 범위에 따라 Y축 스케일 자동 조정

**헌법 준수**: ✅ 규칙 기반, 재현 가능, 테스트 가능 (헌법 II)

---

## 6. 스타일링 접근

### Decision: Tailwind CSS 3

**Rationale**:
- **유틸리티 우선**: 빠른 UI 개발
- **정적 빌드**: 사용된 클래스만 포함, 작은 번들
- **다크 모드**: 내장 지원

**Alternatives Considered**:
| 옵션 | 장점 | 탈락 사유 |
|------|------|-----------|
| CSS Modules | 스코프 격리 | 개발 속도 느림 |
| Styled Components | CSS-in-JS | 런타임 오버헤드 |
| Plain CSS | 의존성 없음 | 유지보수 어려움 |

**헌법 준수**: ✅ 정적 빌드 (헌법 I)

---

## 7. 테스트 전략

### Decision: Vitest + React Testing Library + Snapshot Tests

**Rationale**:
- **Vitest**: Vite와 통합, 빠른 실행
- **React Testing Library**: 사용자 관점 테스트
- **Snapshot Tests**: 시각화 선택 로직의 결정론적 검증

**테스트 범위**:
| 영역 | 테스트 유형 | 목적 |
|------|------------|------|
| 시각화 선택 로직 | Unit + Snapshot | 결정론적 동작 검증 |
| Prometheus 클라이언트 | Unit (Mock) | API 통합 검증 |
| 컴포넌트 | Integration | UI 동작 검증 |

**헌법 준수**: ✅ 시각화 선택 로직 테스트 가능 (헌법 II, V)

---

## 8. 배포 전략

### Decision: GitHub Actions + GitHub Pages

**Rationale**:
- **GitHub Actions**: 자동 빌드 및 배포
- **GitHub Pages**: 무료 정적 호스팅, 프로젝트와 통합

**빌드 결과물**:
- `index.html`
- `assets/` (JS, CSS 번들)
- 총 예상 크기: ~500KB (gzipped)

**헌법 준수**: ✅ 정적 파일만 (헌법 I)

---

## Summary

| 영역 | 선택 | 헌법 준수 |
|------|------|-----------|
| Framework | React 18 + Vite 5 | ✅ I |
| Charts | Apache ECharts 5 | ✅ II |
| State | TanStack Query + Context | ✅ V |
| API Client | Fetch API + Custom Wrapper | ✅ I, III |
| Viz Logic | Rule-based Decision Tree | ✅ II |
| Styling | Tailwind CSS 3 | ✅ I |
| Testing | Vitest + RTL + Snapshot | ✅ II, V |
| Deploy | GitHub Actions + Pages | ✅ I |

**모든 NEEDS CLARIFICATION 해결됨**: ✅
