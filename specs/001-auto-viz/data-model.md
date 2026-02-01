# Data Model: PromQL 자동 시각화

**Feature**: 001-auto-viz  
**Date**: 2026-02-01  
**Status**: Complete

## Entity Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   DataSource    │────▶│     Query       │────▶│  QueryResult    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               ▼
        │                                       ┌─────────────────┐
        └──────────────────────────────────────▶│ Visualization   │
                                                └─────────────────┘
```

---

## 1. DataSource

Prometheus 서버 연결 정보를 나타낸다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | 고유 식별자 (UUID) |
| `name` | `string` | Yes | 사용자가 지정한 이름 |
| `url` | `string` | Yes | Prometheus 서버 Base URL |
| `auth` | `AuthConfig \| null` | No | 인증 설정 (없으면 null) |
| `status` | `ConnectionStatus` | Yes | 연결 상태 |
| `createdAt` | `number` | Yes | 생성 시간 (Unix timestamp) |
| `updatedAt` | `number` | Yes | 수정 시간 (Unix timestamp) |

### AuthConfig

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"bearer"` | Yes | 인증 타입 (현재 Bearer만 지원) |
| `token` | `string` | Yes | Bearer 토큰 |

### ConnectionStatus

```typescript
type ConnectionStatus = "unknown" | "connecting" | "connected" | "error";
```

### Validation Rules

- `url`: 유효한 HTTP/HTTPS URL이어야 함
- `name`: 1-100자, 빈 문자열 불가
- `auth.token`: 비어있지 않은 문자열

### Storage

- **위치**: Browser LocalStorage
- **키**: `autograf:datasources`
- **형식**: JSON 배열

---

## 2. Query

PromQL 쿼리와 실행 파라미터를 나타낸다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `expr` | `string` | Yes | PromQL 표현식 |
| `timeRange` | `TimeRange` | Yes | 시간 범위 |
| `step` | `string` | No | 쿼리 해상도 (예: "15s", "1m") |
| `queryType` | `QueryType` | Yes | 쿼리 타입 |

### TimeRange

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `"relative" \| "absolute"` | Yes | 시간 범위 타입 |
| `from` | `number \| string` | Yes | 시작 시간 |
| `to` | `number \| string` | Yes | 종료 시간 |

**Relative 예시**: `{ type: "relative", from: "now-1h", to: "now" }`  
**Absolute 예시**: `{ type: "absolute", from: 1706745600, to: 1706749200 }`

### QueryType

```typescript
type QueryType = "instant" | "range";
```

### Validation Rules

- `expr`: 비어있지 않은 문자열
- `step`: Prometheus duration 형식 (예: "15s", "1m", "5m")
- `timeRange.from` < `timeRange.to`

---

## 3. QueryResult

Prometheus API 응답 데이터를 나타낸다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `"success" \| "error"` | Yes | 응답 상태 |
| `data` | `ResultData \| null` | No | 결과 데이터 (success 시) |
| `error` | `string \| null` | No | 에러 메시지 (error 시) |
| `errorType` | `string \| null` | No | 에러 타입 (error 시) |

### ResultData

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resultType` | `ResultType` | Yes | 결과 데이터 타입 |
| `result` | `MetricResult[]` | Yes | 메트릭 결과 배열 |

### ResultType

```typescript
type ResultType = "matrix" | "vector" | "scalar" | "string";
```

### MetricResult (Matrix)

| Field | Type | Description |
|-------|------|-------------|
| `metric` | `Record<string, string>` | 레이블 키-값 쌍 |
| `values` | `[number, string][]` | [timestamp, value] 배열 |

### MetricResult (Vector)

| Field | Type | Description |
|-------|------|-------------|
| `metric` | `Record<string, string>` | 레이블 키-값 쌍 |
| `value` | `[number, string]` | [timestamp, value] |

### MetricResult (Scalar/String)

| Field | Type | Description |
|-------|------|-------------|
| `value` | `[number, string]` | [timestamp, value] |

---

## 4. Visualization

선택된 시각화 정보를 나타낸다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `VisualizationType` | Yes | 시각화 타입 |
| `title` | `string` | No | 차트 제목 |
| `config` | `ChartConfig` | Yes | 차트 설정 |

### VisualizationType

```typescript
type VisualizationType = 
  | "line"       // 라인 차트 (시계열)
  | "area"       // 영역 차트 (스택)
  | "bar"        // 바 차트
  | "stat"       // 단일 값 표시
  | "table"      // 테이블
  | "text";      // 텍스트
```

### ChartConfig

ECharts 옵션 객체의 서브셋. 시각화 타입에 따라 구조가 달라짐.

```typescript
interface ChartConfig {
  // 공통
  grid?: GridConfig;
  tooltip?: TooltipConfig;
  legend?: LegendConfig;
  
  // Line/Area
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  series?: SeriesConfig[];
  
  // Stat
  value?: number | string;
  unit?: string;
  
  // Table
  columns?: ColumnConfig[];
  rows?: Record<string, unknown>[];
}
```

---

## 5. AppState

애플리케이션 전역 상태를 나타낸다.

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `dataSources` | `DataSource[]` | 저장된 데이터소스 목록 |
| `activeDataSourceId` | `string \| null` | 현재 활성 데이터소스 ID |
| `currentQuery` | `Query \| null` | 현재 입력된 쿼리 |
| `queryResult` | `QueryResult \| null` | 마지막 쿼리 결과 |
| `visualization` | `Visualization \| null` | 현재 시각화 |
| `isLoading` | `boolean` | 로딩 상태 |
| `error` | `AppError \| null` | 전역 에러 상태 |

### AppError

| Field | Type | Description |
|-------|------|-------------|
| `type` | `ErrorType` | 에러 유형 |
| `message` | `string` | 사용자 친화적 메시지 |
| `details` | `string \| null` | 상세 정보 |
| `suggestion` | `string \| null` | 해결 방법 제안 |

### ErrorType

```typescript
type ErrorType = 
  | "connection"    // 연결 실패
  | "auth"          // 인증 오류
  | "query"         // 쿼리 오류
  | "timeout"       // 타임아웃
  | "cors"          // CORS 오류
  | "visualization" // 시각화 오류
  | "storage"       // 스토리지 오류
  | "unknown";      // 알 수 없는 오류
```

---

## State Transitions

### DataSource Lifecycle

```
┌──────────┐   save    ┌──────────┐   test    ┌───────────┐
│ (new)    │─────────▶│ unknown  │─────────▶│ connecting│
└──────────┘          └──────────┘          └───────────┘
                           ▲                      │
                           │                      ▼
                      ┌────┴────┐           ┌───────────┐
                      │  error  │◀──────────│ connected │
                      └─────────┘   fail    └───────────┘
                                      success     │
                                                  ▼
                                            ┌───────────┐
                                            │  (ready)  │
                                            └───────────┘
```

### Query Execution Flow

```
┌──────────┐   execute   ┌───────────┐   success   ┌─────────┐   analyze   ┌─────────────┐
│  idle    │───────────▶│  loading  │───────────▶│ result  │───────────▶│visualization│
└──────────┘            └───────────┘            └─────────┘            └─────────────┘
                              │                       │
                              │ error                 │ empty
                              ▼                       ▼
                        ┌───────────┐           ┌─────────┐
                        │   error   │           │ no data │
                        └───────────┘           └─────────┘
```

---

## Type Definitions (TypeScript)

전체 타입 정의는 `src/types/` 디렉토리에 배치:

- `src/types/datasource.ts` - DataSource 관련 타입
- `src/types/query.ts` - Query 관련 타입
- `src/types/result.ts` - QueryResult 관련 타입
- `src/types/visualization.ts` - Visualization 관련 타입
- `src/types/state.ts` - AppState 관련 타입
- `src/types/index.ts` - 타입 re-export
