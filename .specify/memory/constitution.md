<!--
=============================================================================
SYNC IMPACT REPORT
=============================================================================
Version Change: 0.0.0 → 1.0.0 (MAJOR - Initial ratification)
Modified Principles: N/A (Initial creation)
Added Sections:
  - Core Principles (5 principles)
  - Technical Constraints
  - Development Standards
  - Governance
Removed Sections: N/A
Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (no changes needed)
  - .specify/templates/spec-template.md: ✅ Compatible (no changes needed)
  - .specify/templates/tasks-template.md: ✅ Compatible (no changes needed)
Follow-up TODOs: None
=============================================================================
-->

# Autograf Constitution

## Core Principles

### I. Static Client-Only Architecture

본 시스템은 GitHub Pages에서 제공되는 **정적 웹 애플리케이션**이다.

- 모든 처리는 **브라우저 환경에서만** 수행되어야 한다 (MUST)
- **서버 사이드 로직은 존재하지 않는다** (MUST NOT)
- Prometheus HTTP API는 **클라이언트에서 직접 호출**된다 (MUST)
- 빌드 결과물은 순수한 정적 파일(HTML, CSS, JS, assets)로만 구성된다 (MUST)

**근거**: 서버 인프라 없이 GitHub Pages만으로 배포 가능한 단순하고 유지보수 용이한 아키텍처를 보장한다.

### II. Deterministic Visualization

시각화 결과는 **결정론적**이며, 외부 요인에 의존하지 않는다.

- **동일한 입력 데이터에 대해 항상 동일한 시각화 결과**를 생성해야 한다 (MUST)
- 시각화 방식 결정은 **데이터 구조, 타입, 통계적 특성에 기반한 명시적이고 재현 가능한 추론 로직**으로 수행된다 (MUST)
- **외부 AI의 "추천"이나 비결정론적 알고리즘에 의존하지 않는다** (MUST NOT)
- 시각화 선택 로직은 **코드로 명시**되어 있어야 하며, 테스트 가능해야 한다 (MUST)

**근거**: 사용자가 동일한 데이터로 일관된 결과를 얻을 수 있도록 하여 예측 가능성과 신뢰성을 보장한다.

### III. Local-Only Security

사용자의 민감한 정보는 **로컬 환경에만 저장**된다.

- 인증 정보(API 토큰, 자격 증명 등)는 **브라우저 로컬 스토리지에만 저장**된다 (MUST)
- 인증 정보는 **외부 서버나 제3자에게 전송되지 않는다** (MUST NOT)
- 데이터 요청은 사용자가 직접 지정한 Prometheus 엔드포인트로만 전송된다 (MUST)

**근거**: 사용자 데이터 프라이버시를 보호하고, 중앙 집중식 데이터 수집을 방지한다.

### IV. Explicit Error Handling

오류 상황은 **명확하고 이해 가능한 방식**으로 사용자에게 전달된다.

- 데이터 해석 실패, 시각화 불가 상황은 **명확한 오류 상태**로 사용자에게 표시된다 (MUST)
- 오류 메시지는 **문제의 원인과 가능한 해결 방법**을 포함해야 한다 (SHOULD)
- **조용한 실패(silent failure)는 허용되지 않는다** (MUST NOT)
- 시스템 상태는 항상 사용자에게 **투명하게 표시**된다 (MUST)

**근거**: 사용자가 문제 상황을 정확히 인식하고 적절한 조치를 취할 수 있도록 한다.

### V. Code Quality Standards

코드 품질은 **가독성, 명확성, 예측 가능성**을 최우선으로 한다.

- 코드는 **읽기 쉽고 이해하기 쉬워야** 한다 (MUST)
- 함수와 모듈은 **명확한 단일 책임**을 가져야 한다 (MUST)
- 동작은 **예측 가능**해야 하며, 숨겨진 부작용이 없어야 한다 (MUST)
- **복잡한 추상화보다 명시적인 코드**를 선호한다 (SHOULD)
- 모든 공개 인터페이스는 **타입이 명시**되어야 한다 (MUST)

**근거**: 유지보수성과 협업 효율성을 높이고, 버그 발생 가능성을 줄인다.

## Technical Constraints

### 플랫폼 및 배포

- **호스팅**: GitHub Pages (정적 파일만)
- **빌드 결과물**: HTML, CSS, JavaScript, 정적 에셋
- **런타임 환경**: 현대 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전)

### 데이터 소스

- **대상 API**: Prometheus HTTP API
- **통신 방식**: 클라이언트 → Prometheus 직접 HTTP 요청
- **인증**: 사용자 제공 토큰 (로컬 저장)

### 제한 사항

- 서버 사이드 렌더링 (SSR) 금지
- 백엔드 API 서버 금지
- 외부 분석 서비스 (GA 등) 금지
- 사용자 데이터 외부 전송 금지

## Development Standards

### 테스트

- 시각화 선택 로직은 **단위 테스트로 검증** 가능해야 한다
- 동일 입력에 대한 결정론적 출력은 **스냅샷 테스트**로 보장한다

### 문서화

- 시각화 선택 기준은 **코드 주석 및 문서로 명시**한다
- API 통합 방식은 **사용자 가이드에 문서화**한다

### 코드 스타일

- TypeScript strict mode 사용
- ESLint/Prettier 설정 준수
- 명시적 타입 선언 필수

## Governance

본 헌법은 Autograf 프로젝트의 **최상위 규범**으로서, 모든 설계 결정과 구현에 우선한다.

### 준수 검증

- 모든 PR/코드 리뷰는 헌법 준수 여부를 **명시적으로 확인**해야 한다
- 원칙 위반이 발견되면 해당 변경은 **승인될 수 없다**
- 원칙 위반이 불가피한 경우, **Complexity Tracking** 문서에 정당성을 기록해야 한다

### 개정 절차

1. 개정 제안은 **문서화**되어야 한다
2. 개정은 기존 기능에 대한 **마이그레이션 계획**을 포함해야 한다
3. 개정 후 모든 관련 문서(템플릿, 가이드 등)를 **동기화**해야 한다

### 버전 관리

- **MAJOR**: 원칙 삭제 또는 근본적 재정의 (하위 호환성 파괴)
- **MINOR**: 새 원칙/섹션 추가 또는 실질적 확장
- **PATCH**: 명확화, 문구 수정, 오타 수정

**Version**: 1.0.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01
