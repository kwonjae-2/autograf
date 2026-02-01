# API Contract: Prometheus HTTP API

**Feature**: 001-auto-viz  
**Date**: 2026-02-01  
**Status**: Complete

## Overview

Autograf는 Prometheus HTTP API v1을 클라이언트에서 직접 호출한다. 이 문서는 사용하는 엔드포인트와 예상 응답 형식을 정의한다.

**Base URL**: 사용자가 입력한 Prometheus 서버 URL (예: `https://prometheus.example.com`)

---

## 1. Connection Test

### Endpoint

```
GET {baseUrl}/api/v1/labels
```

### Purpose

데이터소스 연결 상태를 확인한다.

### Request

```http
GET /api/v1/labels HTTP/1.1
Host: prometheus.example.com
Authorization: Bearer {token}  # optional
```

### Response (Success)

```json
{
  "status": "success",
  "data": ["__name__", "instance", "job", ...]
}
```

### Response (Error)

```json
{
  "status": "error",
  "errorType": "bad_data",
  "error": "error message"
}
```

### Client Handling

| HTTP Status | Action |
|-------------|--------|
| 200 | 연결 성공 → `connected` |
| 401 | 인증 오류 → `error` (재인증 요청) |
| 403 | 권한 오류 → `error` (권한 확인 안내) |
| 404 | URL 오류 → `error` (URL 확인 안내) |
| 0 (Network) | 연결 실패 → `error` (CORS/네트워크 확인) |

---

## 2. Instant Query

### Endpoint

```
GET {baseUrl}/api/v1/query
```

### Purpose

특정 시점의 PromQL 쿼리 결과를 가져온다.

### Request

```http
GET /api/v1/query?query={expr}&time={timestamp} HTTP/1.1
Host: prometheus.example.com
Authorization: Bearer {token}  # optional
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | PromQL 표현식 |
| `time` | RFC3339 or Unix timestamp | No | 평가 시점 (기본: 현재) |
| `timeout` | duration | No | 평가 타임아웃 |

### Response (Success - Vector)

```json
{
  "status": "success",
  "data": {
    "resultType": "vector",
    "result": [
      {
        "metric": {
          "__name__": "up",
          "instance": "localhost:9090",
          "job": "prometheus"
        },
        "value": [1706745600, "1"]
      }
    ]
  }
}
```

### Response (Success - Scalar)

```json
{
  "status": "success",
  "data": {
    "resultType": "scalar",
    "result": [1706745600, "42"]
  }
}
```

### Response (Success - String)

```json
{
  "status": "success",
  "data": {
    "resultType": "string",
    "result": [1706745600, "hello"]
  }
}
```

### Response (Error)

```json
{
  "status": "error",
  "errorType": "bad_data",
  "error": "invalid expression: parse error"
}
```

---

## 3. Range Query

### Endpoint

```
GET {baseUrl}/api/v1/query_range
```

### Purpose

시간 범위에 걸친 PromQL 쿼리 결과를 가져온다.

### Request

```http
GET /api/v1/query_range?query={expr}&start={start}&end={end}&step={step} HTTP/1.1
Host: prometheus.example.com
Authorization: Bearer {token}  # optional
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | PromQL 표현식 |
| `start` | RFC3339 or Unix timestamp | Yes | 시작 시간 |
| `end` | RFC3339 or Unix timestamp | Yes | 종료 시간 |
| `step` | duration or float | Yes | 쿼리 해상도 (예: "15s", "1m") |
| `timeout` | duration | No | 평가 타임아웃 |

### Response (Success - Matrix)

```json
{
  "status": "success",
  "data": {
    "resultType": "matrix",
    "result": [
      {
        "metric": {
          "__name__": "up",
          "instance": "localhost:9090",
          "job": "prometheus"
        },
        "values": [
          [1706745600, "1"],
          [1706745615, "1"],
          [1706745630, "1"]
        ]
      },
      {
        "metric": {
          "__name__": "up",
          "instance": "localhost:9091",
          "job": "node"
        },
        "values": [
          [1706745600, "1"],
          [1706745615, "0"],
          [1706745630, "1"]
        ]
      }
    ]
  }
}
```

### Response (Error)

```json
{
  "status": "error",
  "errorType": "timeout",
  "error": "query timed out in expression evaluation"
}
```

---

## Error Types

Prometheus API가 반환하는 에러 타입:

| errorType | Description | User Message |
|-----------|-------------|--------------|
| `bad_data` | 잘못된 쿼리 또는 파라미터 | 쿼리 문법을 확인하세요 |
| `timeout` | 쿼리 타임아웃 | 시간 범위를 줄이거나 step을 늘려보세요 |
| `canceled` | 쿼리 취소됨 | 쿼리가 취소되었습니다 |
| `execution` | 쿼리 실행 오류 | 쿼리 실행 중 오류가 발생했습니다 |
| `internal` | 서버 내부 오류 | 서버 오류가 발생했습니다 |

---

## Client Implementation

### Request Headers

```typescript
const headers: HeadersInit = {
  'Accept': 'application/json',
};

if (auth?.token) {
  headers['Authorization'] = `Bearer ${auth.token}`;
}
```

### Error Handling

```typescript
async function handleResponse(response: Response): Promise<PrometheusResponse> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new AppError('auth', '인증에 실패했습니다', null, '토큰을 확인해주세요');
    }
    if (response.status === 403) {
      throw new AppError('auth', '접근 권한이 없습니다', null, '권한을 확인해주세요');
    }
    // ... other status codes
  }
  
  const data = await response.json();
  
  if (data.status === 'error') {
    throw new AppError('query', data.error, data.errorType, getErrorSuggestion(data.errorType));
  }
  
  return data;
}
```

### CORS Handling

```typescript
async function fetchWithCorsHandling(url: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new AppError(
        'cors',
        'Prometheus 서버에 연결할 수 없습니다',
        'CORS 또는 네트워크 오류',
        'Prometheus 서버의 CORS 설정을 확인하거나, 프록시를 통해 접근해주세요'
      );
    }
    throw error;
  }
}
```

---

## Rate Limiting

Prometheus 서버에 따라 rate limiting이 적용될 수 있다:

- **클라이언트 측 대응**: 
  - 쿼리 실행 버튼 debounce (300ms)
  - 동시 쿼리 제한 (1개)
  - 429 응답 시 재시도 안내

---

## Data Size Considerations

| Scenario | Max Data Points | Recommendation |
|----------|-----------------|----------------|
| 1시간 / 15s step | 240 | ✅ 정상 |
| 6시간 / 15s step | 1,440 | ✅ 정상 |
| 24시간 / 15s step | 5,760 | ⚠️ 경고 표시 |
| 7일 / 15s step | 40,320 | ⚠️ step 증가 권장 |

**경고 임계값**: 10,000 데이터 포인트

```typescript
function validateQueryParams(start: number, end: number, step: number): ValidationResult {
  const expectedPoints = (end - start) / step;
  
  if (expectedPoints > 10000) {
    return {
      valid: true,
      warning: `예상 데이터 포인트가 ${Math.round(expectedPoints)}개입니다. step을 늘리는 것을 권장합니다.`
    };
  }
  
  return { valid: true };
}
```
