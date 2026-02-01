# Feature Specification: PromQL 자동 시각화

**Feature Branch**: `001-auto-viz`  
**Created**: 2026-02-01  
**Status**: Draft  
**Input**: User description: "GitHub Pages에서 제공되는 웹 애플리케이션. Prometheus Datasource 설정 후 PromQL 쿼리 실행 시 결과를 자동으로 시각화"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - PromQL 쿼리 실행 및 자동 시각화 (Priority: P1)

사용자가 Prometheus 서버에 연결하여 PromQL 쿼리를 실행하고, 시스템이 쿼리 결과를 자동으로 분석하여 적합한 시각화를 생성한다.

**Why this priority**: 애플리케이션의 핵심 가치 제안. 이 기능 없이는 제품이 존재 의미가 없다. 최소한의 기능으로도 사용자에게 즉각적인 가치를 제공한다.

**Independent Test**: Prometheus URL만 입력하고 간단한 PromQL(`up`)을 실행하여 차트가 렌더링되는지 확인. 이것만으로 MVP의 핵심 가치를 검증할 수 있다.

**Acceptance Scenarios**:

1. **Given** 사용자가 유효한 Prometheus URL을 입력한 상태, **When** PromQL `up`을 입력하고 실행 버튼을 클릭, **Then** 쿼리 결과가 차트로 시각화되어 화면에 표시된다
2. **Given** 쿼리가 실행된 상태, **When** 결과 데이터가 시계열 벡터인 경우, **Then** 시스템이 라인 차트를 자동 선택하여 렌더링한다
3. **Given** 쿼리가 실행된 상태, **When** 결과 데이터가 단일 인스턴트 벡터인 경우, **Then** 시스템이 테이블 또는 적절한 차트를 자동 선택한다
4. **Given** 쿼리 결과가 표시된 상태, **When** 사용자가 원본 데이터 보기를 요청, **Then** JSON 형식의 원본 쿼리 결과가 표시된다

---

### User Story 2 - 데이터소스 연결 설정 (Priority: P2)

사용자가 Prometheus 서버의 연결 정보(URL, 인증)를 입력하고 저장하여 재사용할 수 있다.

**Why this priority**: 쿼리 실행의 전제 조건이지만, 매번 URL을 직접 입력해도 P1은 동작 가능. 저장 기능은 사용성 향상을 위한 것.

**Independent Test**: URL과 인증 토큰을 입력하고 저장 후, 브라우저를 새로고침해도 설정이 유지되는지 확인.

**Acceptance Scenarios**:

1. **Given** 애플리케이션 초기 화면, **When** 사용자가 Prometheus URL을 입력, **Then** 연결 테스트를 수행하고 결과를 표시한다
2. **Given** 유효한 URL이 입력된 상태, **When** 인증이 필요한 경우 Bearer 토큰을 입력, **Then** 인증 정보가 브라우저 로컬 스토리지에만 저장된다
3. **Given** 설정이 저장된 상태, **When** 브라우저를 새로고침하거나 재방문, **Then** 저장된 설정이 자동으로 로드된다
4. **Given** 저장된 설정이 있는 상태, **When** 사용자가 설정 삭제를 요청, **Then** 모든 저장된 인증 정보가 로컬에서 완전히 삭제된다

---

### User Story 3 - 시간 범위 및 Step 설정 (Priority: P3)

사용자가 쿼리의 시간 범위(시작/종료 시간)와 데이터 해상도(step)를 선택할 수 있다.

**Why this priority**: Range Query에 필수적인 파라미터이지만, 기본값(최근 1시간, 15초 step)으로도 P1이 동작 가능.

**Independent Test**: 시간 범위를 "최근 6시간"으로 변경하고 쿼리 실행 시 해당 범위의 데이터가 반환되는지 확인.

**Acceptance Scenarios**:

1. **Given** 쿼리 입력 화면, **When** 시간 범위 선택기에서 "최근 1시간"을 선택, **Then** 쿼리 파라미터에 적절한 start/end 시간이 설정된다
2. **Given** 쿼리 입력 화면, **When** 사용자가 커스텀 시작/종료 시간을 입력, **Then** 해당 시간 범위로 쿼리가 실행된다
3. **Given** 시간 범위가 설정된 상태, **When** step 값을 변경, **Then** 변경된 해상도로 데이터가 조회된다
4. **Given** 시간 범위 대비 step이 너무 작아 데이터 포인트가 과도한 경우, **When** 쿼리 실행 시도, **Then** 경고 메시지와 함께 적절한 step 값을 제안한다

---

### User Story 4 - 쿼리 오류 처리 (Priority: P4)

쿼리 실행 중 발생하는 다양한 오류 상황을 사용자에게 명확하게 전달한다.

**Why this priority**: 핵심 기능은 아니지만, 헌법 IV (Explicit Error Handling)에서 요구하는 필수 품질 속성.

**Independent Test**: 의도적으로 잘못된 PromQL을 입력하고 오류 메시지가 명확하게 표시되는지 확인.

**Acceptance Scenarios**:

1. **Given** 유효하지 않은 Prometheus URL이 입력된 상태, **When** 쿼리 실행, **Then** 연결 실패 오류와 함께 가능한 원인(네트워크, CORS, URL 오류)을 표시한다
2. **Given** 유효한 연결 상태, **When** 문법 오류가 있는 PromQL 실행, **Then** Prometheus에서 반환한 오류 메시지를 사용자 친화적으로 표시한다
3. **Given** 유효한 쿼리 상태, **When** 쿼리 결과가 비어있는 경우, **Then** "결과 없음" 상태를 명확히 표시하고 가능한 원인을 안내한다
4. **Given** 쿼리 실행 중 상태, **When** 네트워크 타임아웃 발생, **Then** 타임아웃 오류를 표시하고 재시도 옵션을 제공한다

---

### Edge Cases

- **빈 결과 처리**: 쿼리가 성공했지만 결과 데이터가 없는 경우 → "데이터 없음" 상태를 명확히 표시
- **대량 데이터 처리**: 결과 데이터 포인트가 매우 많은 경우 (10,000개 이상) → 성능 경고 및 step 증가 권장
- **혼합 결과 타입**: 쿼리 결과에 여러 metric이 포함된 경우 → 각 metric을 별도 시리즈로 시각화
- **CORS 제한**: Prometheus 서버가 CORS를 허용하지 않는 경우 → 명확한 오류 메시지와 해결 방법 안내
- **인증 만료**: 저장된 토큰이 만료된 경우 → 인증 오류를 감지하고 재인증 요청
- **브라우저 스토리지 비활성화**: 로컬 스토리지를 사용할 수 없는 경우 → 세션 내에서만 동작하며 저장 불가 안내

## Requirements *(mandatory)*

### Functional Requirements

**데이터소스 설정**
- **FR-001**: 사용자는 Prometheus 서버의 Base URL을 입력할 수 있어야 한다 (MUST)
- **FR-002**: 시스템은 입력된 URL에 대해 연결 테스트를 수행하고 결과를 표시해야 한다 (MUST)
- **FR-003**: 사용자는 선택적으로 Bearer 토큰 인증 정보를 입력할 수 있어야 한다 (MUST)
- **FR-004**: 인증 정보는 브라우저 로컬 스토리지에만 저장되어야 하며, 외부로 전송되어서는 안 된다 (MUST - 헌법 III 준수)

**쿼리 실행**
- **FR-005**: 사용자는 PromQL 쿼리를 텍스트로 입력할 수 있어야 한다 (MUST)
- **FR-006**: 사용자는 시간 범위(start, end)를 선택할 수 있어야 한다 (MUST)
- **FR-007**: 사용자는 쿼리 해상도(step)를 설정할 수 있어야 한다 (MUST)
- **FR-008**: 시스템은 Prometheus HTTP API `/api/v1/query_range` 또는 `/api/v1/query`를 직접 호출해야 한다 (MUST - 헌법 I 준수)

**자동 시각화**
- **FR-009**: 시스템은 쿼리 결과의 데이터 타입(matrix, vector, scalar, string)을 자동으로 분석해야 한다 (MUST)
- **FR-010**: 시스템은 데이터 분석 결과를 바탕으로 적합한 시각화 타입을 자동 선택해야 한다 (MUST - 헌법 II 준수)
- **FR-011**: 동일한 입력 데이터에 대해 항상 동일한 시각화 결과가 생성되어야 한다 (MUST - 헌법 II 준수)
- **FR-012**: 시각화 선택 로직은 명시적이고 재현 가능해야 하며, 외부 AI나 비결정론적 알고리즘에 의존하지 않아야 한다 (MUST - 헌법 II 준수)
- **FR-013**: 선택된 시각화는 즉시 차트로 렌더링되어 화면에 표시되어야 한다 (MUST)

**데이터 확인**
- **FR-014**: 사용자는 시각화된 결과와 함께 원본 쿼리 결과를 JSON 형식으로 확인할 수 있어야 한다 (MUST)

**오류 처리**
- **FR-015**: 모든 오류 상황(연결 실패, 쿼리 오류, 데이터 해석 실패)은 명확한 메시지로 사용자에게 표시되어야 한다 (MUST - 헌법 IV 준수)
- **FR-016**: 오류 메시지는 문제의 원인과 가능한 해결 방법을 포함해야 한다 (SHOULD - 헌법 IV 권장)

### Key Entities

- **DataSource**: Prometheus 서버 연결 정보 (URL, 인증 토큰, 연결 상태)
- **Query**: PromQL 표현식과 실행 파라미터 (쿼리 텍스트, 시간 범위, step)
- **QueryResult**: Prometheus API 응답 데이터 (결과 타입, 메트릭 데이터, 타임스탬프)
- **Visualization**: 선택된 시각화 정보 (차트 타입, 렌더링 설정)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 URL 입력부터 첫 번째 차트 시각화까지 3분 이내에 완료할 수 있다
- **SC-002**: 동일한 PromQL과 시간 범위로 쿼리 시 100% 동일한 시각화 결과가 생성된다
- **SC-003**: 쿼리 결과가 화면에 표시되기까지 2초 이내에 완료된다 (Prometheus 응답 시간 제외)
- **SC-004**: 모든 오류 상황에서 사용자에게 오류 메시지가 표시되며, silent failure가 0건이다
- **SC-005**: 90% 이상의 사용자가 첫 시도에서 쿼리 실행 및 시각화를 성공적으로 완료한다
- **SC-006**: 인증 정보가 외부 서버로 전송되는 경우가 0건이다 (사용자 지정 Prometheus 제외)

## Assumptions

- 사용자는 기본적인 PromQL 문법을 이해하고 있다
- 대상 Prometheus 서버는 CORS를 허용하도록 설정되어 있거나, 사용자가 프록시를 통해 접근할 수 있다
- 현대 브라우저(Chrome, Firefox, Safari, Edge 최신 2개 버전)에서 실행된다
- 기본 시간 범위는 "최근 1시간", 기본 step은 "15초"로 설정된다
- 지원하는 시각화 타입: 라인 차트(time series), 바 차트, 테이블, 단일 값 표시
