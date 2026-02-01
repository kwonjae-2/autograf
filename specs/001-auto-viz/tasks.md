# Tasks: PromQL 자동 시각화

**Input**: Design documents from `/specs/001-auto-viz/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: 명세서에서 테스트가 명시적으로 요청되지 않았으므로, 핵심 로직(시각화 선택)에 대한 단위 테스트만 포함합니다.

**Organization**: User Story 우선순위(P1→P4)에 따라 구성되며, 각 스토리는 독립적으로 구현/테스트 가능합니다.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 병렬 실행 가능 (다른 파일, 의존성 없음)
- **[Story]**: User Story 소속 (US1, US2, US3, US4)
- 모든 태스크에 정확한 파일 경로 포함

## Path Conventions

```
src/
├── components/          # React UI 컴포넌트
├── services/            # 비즈니스 로직
├── types/               # TypeScript 타입 정의
├── hooks/               # React Custom Hooks
├── utils/               # 유틸리티 함수
├── App.tsx
├── main.tsx
└── index.css

tests/
├── unit/
└── snapshots/
```

---

## Phase 1: Setup (프로젝트 초기화) ✅ COMPLETE

**Purpose**: Vite + React + TypeScript 프로젝트 초기화 및 기본 설정

- [x] T001 Create project with Vite React-TS template at repository root
- [x] T002 Install core dependencies (react, react-dom, echarts, echarts-for-react, @tanstack/react-query) in package.json
- [x] T003 [P] Install dev dependencies (vitest, @testing-library/react, @testing-library/jest-dom) in package.json
- [x] T004 [P] Install styling dependencies (tailwindcss, postcss, autoprefixer) in package.json
- [x] T005 Configure TypeScript strict mode in tsconfig.json
- [x] T006 [P] Configure Tailwind CSS in tailwind.config.js and src/index.css
- [x] T007 [P] Configure Vitest in vitest.config.ts
- [x] T008 [P] Configure ESLint and Prettier in eslint.config.js and .prettierrc
- [x] T009 Create directory structure (src/components/, src/services/, src/types/, src/hooks/, src/utils/, tests/)
- [x] T010 Configure Vite for GitHub Pages deployment (base path) in vite.config.ts
- [x] T011 [P] Create GitHub Actions workflow for deployment in .github/workflows/deploy.yml

**Checkpoint**: ✅ 프로젝트 구조 완성, `npm run dev` 실행 가능, `npm run build` 성공

---

## Phase 2: Foundational (핵심 인프라) ✅ COMPLETE

**Purpose**: 모든 User Story에서 공유하는 핵심 타입, 서비스, 오류 처리 인프라

### Types (타입 정의)

- [x] T012 [P] Create DataSource types (DataSource, AuthConfig, ConnectionStatus) in src/types/datasource.ts
- [x] T013 [P] Create Query types (Query, TimeRange, QueryType) in src/types/query.ts
- [x] T014 [P] Create QueryResult types (QueryResult, ResultData, ResultType, MetricResult) in src/types/result.ts
- [x] T015 [P] Create Visualization types (Visualization, VisualizationType, ChartConfig) in src/types/visualization.ts
- [x] T016 [P] Create AppState and AppError types (AppState, AppError, ErrorType) in src/types/state.ts
- [x] T017 Create type re-exports in src/types/index.ts

### Core Services (핵심 서비스)

- [x] T018 Implement Prometheus HTTP client (query, queryRange, testConnection) in src/services/prometheus/client.ts
- [x] T019 [P] Implement response parser (parseQueryResult, normalizeError) in src/services/prometheus/parser.ts
- [x] T020 [P] Implement LocalStorage service (save, load, remove for datasources) in src/services/storage/localStorage.ts

### Error Handling Infrastructure (오류 처리 인프라)

- [x] T021 Create AppError class with type, message, details, suggestion in src/utils/errors.ts
- [x] T022 [P] Create error message mappings (connection, auth, query, cors, timeout) in src/utils/errorMessages.ts

### Common UI Components (공통 UI)

- [x] T023 [P] Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx
- [x] T024 [P] Create ErrorDisplay component (shows message + suggestion) in src/components/common/ErrorDisplay.tsx
- [x] T025 [P] Create Button component in src/components/common/Button.tsx
- [x] T026 [P] Create Input component in src/components/common/Input.tsx
- [x] T027 Create common components re-export in src/components/common/index.ts

### App Shell (앱 구조)

- [x] T028 Setup TanStack Query provider in src/main.tsx
- [x] T029 Create basic App layout with header and main content area in src/App.tsx

**Checkpoint**: ✅ Foundation ready - `npm run dev` 실행 시 앱 레이아웃 표시

---

## Phase 3: User Story 1 - PromQL 쿼리 실행 및 자동 시각화 (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Prometheus URL 입력 → PromQL 쿼리 실행 → 자동 시각화 생성

**Independent Test**: URL만 입력하고 `up` 쿼리 실행 시 라인 차트가 렌더링되는지 확인

### Core Analyzer Logic (시각화 선택 로직)

- [x] T030 [P] [US1] Implement result type analyzer (detectResultType) in src/services/analyzer/resultTypeAnalyzer.ts
- [x] T031 [P] [US1] Implement series counter (countSeries, countDataPoints) in src/services/analyzer/seriesAnalyzer.ts
- [x] T032 [US1] Implement visualization selector (selectVisualization - rule-based decision tree) in src/services/analyzer/visualizationSelector.ts
- [x] T033 [US1] Create unit tests for visualization selector (deterministic verification) in tests/unit/analyzer/visualizationSelector.test.ts

### Chart Spec Generation (차트 스펙 생성)

- [x] T034 [P] [US1] Implement line chart spec generator in src/services/analyzer/specs/lineChartSpec.ts
- [x] T035 [P] [US1] Implement area chart spec generator in src/services/analyzer/specs/areaChartSpec.ts
- [x] T036 [P] [US1] Implement bar chart spec generator in src/services/analyzer/specs/barChartSpec.ts
- [x] T037 [P] [US1] Implement stat display spec generator in src/services/analyzer/specs/statSpec.ts
- [x] T038 [P] [US1] Implement table spec generator in src/services/analyzer/specs/tableSpec.ts
- [x] T039 [US1] Create chart spec factory (createChartSpec) in src/services/analyzer/chartSpecFactory.ts

### Query Execution Hook

- [x] T040 [US1] Implement usePrometheusQuery hook (execute query, manage loading/error state) in src/hooks/usePrometheusQuery.ts

### Query Editor UI

- [x] T041 [P] [US1] Create PromQL text input component in src/components/QueryEditor/PromQLInput.tsx
- [x] T042 [P] [US1] Create URL input component (temporary, for MVP) in src/components/QueryEditor/UrlInput.tsx
- [x] T043 [US1] Create QueryEditor container (combines URL input + PromQL input + execute button) in src/components/QueryEditor/QueryEditor.tsx
- [x] T044 [US1] Create QueryEditor re-export in src/components/QueryEditor/index.ts

### Visualization UI

- [x] T045 [P] [US1] Create ECharts wrapper component in src/components/Visualization/Chart.tsx
- [x] T046 [P] [US1] Create StatDisplay component (single value) in src/components/Visualization/StatDisplay.tsx
- [x] T047 [P] [US1] Create DataTable component in src/components/Visualization/DataTable.tsx
- [x] T048 [US1] Create VisualizationPanel container (selects and renders appropriate viz) in src/components/Visualization/VisualizationPanel.tsx
- [x] T049 [US1] Create Visualization re-export in src/components/Visualization/index.ts

### Raw Data Display

- [x] T050 [US1] Create RawDataViewer component (JSON display with toggle) in src/components/Visualization/RawDataViewer.tsx

### Integration

- [x] T051 [US1] Integrate QueryEditor and VisualizationPanel in src/App.tsx
- [x] T052 [US1] Add loading state display during query execution in src/App.tsx
- [x] T053 [US1] Add error state display for query failures in src/App.tsx

**Checkpoint**: ✅ MVP 완성 - URL 입력 → PromQL 실행 → 차트 렌더링 전체 흐름 동작
- 13개 테스트 통과 (결정론적 시각화 검증)
- 빌드 성공 (dist/ 생성)

---

## Phase 4: User Story 2 - 데이터소스 연결 설정 (Priority: P2)

**Goal**: Prometheus 연결 정보(URL, 인증)를 저장하고 재사용

**Independent Test**: URL + 토큰 저장 후 브라우저 새로고침 → 설정 유지 확인

### DataSource Management Service

- [ ] T054 [US2] Implement DataSource CRUD service (create, read, update, delete) in src/services/storage/dataSourceService.ts
- [ ] T055 [US2] Implement connection test service (testConnection with status update) in src/services/prometheus/connectionTest.ts

### DataSource Hooks

- [ ] T056 [US2] Implement useDataSources hook (list, active, save, delete) in src/hooks/useDataSources.ts

### DataSource UI

- [ ] T057 [P] [US2] Create DataSourceForm component (URL + auth token inputs) in src/components/DataSource/DataSourceForm.tsx
- [ ] T058 [P] [US2] Create ConnectionStatus indicator component in src/components/DataSource/ConnectionStatus.tsx
- [ ] T059 [P] [US2] Create DataSourceList component (saved datasources) in src/components/DataSource/DataSourceList.tsx
- [ ] T060 [US2] Create DataSourcePanel container in src/components/DataSource/DataSourcePanel.tsx
- [ ] T061 [US2] Create DataSource re-export in src/components/DataSource/index.ts

### Integration

- [ ] T062 [US2] Replace temporary URL input with DataSourcePanel in src/App.tsx
- [ ] T063 [US2] Connect active datasource to query execution in src/hooks/usePrometheusQuery.ts

**Checkpoint**: 데이터소스 저장/불러오기 동작, 새로고침 후 유지

---

## Phase 5: User Story 3 - 시간 범위 및 Step 설정 (Priority: P3)

**Goal**: 쿼리 시간 범위와 데이터 해상도(step) 설정 기능

**Independent Test**: 시간 범위를 "최근 6시간"으로 변경 후 쿼리 실행 → 해당 범위 데이터 반환 확인

### Time Range Logic

- [ ] T064 [P] [US3] Implement time range presets (last 1h, 6h, 24h, 7d) in src/utils/timeRangePresets.ts
- [ ] T065 [P] [US3] Implement time range resolver (relative to absolute) in src/utils/timeRangeResolver.ts
- [ ] T066 [US3] Implement step validator (warn if too many data points) in src/utils/stepValidator.ts

### Time Range UI

- [ ] T067 [P] [US3] Create TimeRangeSelector component (preset dropdown + custom inputs) in src/components/QueryEditor/TimeRangeSelector.tsx
- [ ] T068 [P] [US3] Create StepInput component with validation in src/components/QueryEditor/StepInput.tsx
- [ ] T069 [US3] Integrate TimeRangeSelector and StepInput into QueryEditor in src/components/QueryEditor/QueryEditor.tsx

### Integration

- [ ] T070 [US3] Update usePrometheusQuery to use time range and step parameters in src/hooks/usePrometheusQuery.ts

**Checkpoint**: 시간 범위/step 변경 시 쿼리 결과 변화 확인

---

## Phase 6: User Story 4 - 쿼리 오류 처리 (Priority: P4)

**Goal**: 다양한 오류 상황을 명확하게 사용자에게 전달

**Independent Test**: 잘못된 PromQL 입력 시 명확한 오류 메시지 + 해결 방법 표시 확인

### Error Classification

- [ ] T071 [US4] Implement error classifier (network, cors, auth, query, timeout) in src/services/prometheus/errorClassifier.ts
- [ ] T072 [US4] Implement CORS error detector in src/utils/corsDetector.ts

### Error UI

- [ ] T073 [P] [US4] Create ConnectionErrorDisplay (network/CORS errors with troubleshooting) in src/components/common/ConnectionErrorDisplay.tsx
- [ ] T074 [P] [US4] Create QueryErrorDisplay (PromQL syntax errors) in src/components/common/QueryErrorDisplay.tsx
- [ ] T075 [P] [US4] Create EmptyResultDisplay (no data message with suggestions) in src/components/common/EmptyResultDisplay.tsx
- [ ] T076 [P] [US4] Create TimeoutErrorDisplay (timeout with retry option) in src/components/common/TimeoutErrorDisplay.tsx

### Integration

- [ ] T077 [US4] Integrate error displays into App based on error type in src/App.tsx
- [ ] T078 [US4] Add retry functionality for timeout errors in src/hooks/usePrometheusQuery.ts

**Checkpoint**: 모든 오류 유형에 대해 명확한 메시지 + 해결 방법 표시

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: 최종 마무리, 성능 최적화, 배포 준비

### UI Polish

- [x] T079 [P] Add app title, favicon, meta tags in index.html
- [ ] T080 [P] Add responsive layout styles in src/index.css
- [ ] T081 [P] Add dark mode support (optional) in tailwind.config.js

### Performance

- [ ] T082 Implement query result caching with TanStack Query in src/hooks/usePrometheusQuery.ts
- [ ] T083 Add large dataset warning (>10k points) in src/components/Visualization/VisualizationPanel.tsx

### Documentation

- [ ] T084 [P] Update README.md with usage instructions
- [ ] T085 [P] Add inline JSDoc comments to public functions in src/services/

### Final Validation

- [ ] T086 Run full quickstart.md validation flow
- [ ] T087 Verify deterministic visualization with snapshot tests in tests/snapshots/
- [x] T088 Test production build (`npm run build`) and preview (`npm run preview`)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ✅
     │
     ▼
Phase 2 (Foundational) ✅ ────┬──────────┬──────────┬──────────┐
     │                        │          │          │          │
     ▼                        ▼          ▼          ▼          ▼
Phase 3 (US1/P1) ✅ ──► Phase 4 (US2/P2)  Phase 5 (US3/P3)  Phase 6 (US4/P4)
     │                        │          │          │
     └────────────────────────┴──────────┴──────────┘
                              │
                              ▼
                      Phase 7 (Polish)
```

### Progress Summary

| Phase | Status | Completed | Total |
|-------|--------|-----------|-------|
| Phase 1: Setup | ✅ Complete | 11 | 11 |
| Phase 2: Foundational | ✅ Complete | 18 | 18 |
| Phase 3: US1 (MVP) | ✅ Complete | 24 | 24 |
| Phase 4: US2 | ⏳ Pending | 0 | 10 |
| Phase 5: US3 | ⏳ Pending | 0 | 7 |
| Phase 6: US4 | ⏳ Pending | 0 | 8 |
| Phase 7: Polish | 🔄 Partial | 2 | 10 |
| **Total** | | **55** | **88** |

---

## Notes

- [P] 태스크 = 다른 파일, 의존성 없음 → 병렬 실행 가능
- [USn] 라벨 = 특정 User Story에 속함
- 각 체크포인트에서 해당 스토리 독립 테스트 가능
- 커밋은 태스크 또는 논리적 그룹 단위로 수행
- **MVP 범위 완료**: Phase 1-3 (US1까지) ✅
