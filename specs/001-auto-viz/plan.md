# Implementation Plan: PromQL 자동 시각화

**Branch**: `001-auto-viz` | **Date**: 2026-02-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auto-viz/spec.md`

## Summary

Prometheus HTTP API에서 PromQL 쿼리를 실행하고, 결과 데이터의 구조와 특성을 분석하여 적합한 시각화를 자동으로 생성하는 정적 웹 애플리케이션을 구현한다. 모든 처리는 브라우저에서 수행되며, GitHub Pages에서 호스팅된다.

**핵심 기술 접근**:
- SPA (Single Page Application) 아키텍처
- 클라이언트에서 Prometheus HTTP API 직접 호출
- 규칙 기반 결정론적 시각화 선택 로직
- JSON 기반 차트 스펙을 사용한 렌더링

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)  
**Framework**: React 18.x  
**Build Tool**: Vite 5.x  
**Primary Dependencies**:
- React 18 (UI 프레임워크)
- Apache ECharts 5.x (차트 라이브러리 - JSON 스펙 기반)
- TanStack Query (데이터 페칭/캐싱)
- Tailwind CSS 3.x (스타일링)

**Storage**: Browser LocalStorage (인증 정보, 설정 저장)  
**Testing**: Vitest + React Testing Library  
**Target Platform**: 현대 웹 브라우저 (Chrome, Firefox, Safari, Edge 최신 2개 버전)  
**Project Type**: Frontend-only SPA (no backend)  
**Performance Goals**: 
- 쿼리 결과 렌더링 2초 이내 (Prometheus 응답 시간 제외)
- 10,000 데이터 포인트까지 원활한 차트 렌더링

**Constraints**:
- 정적 파일만 (HTML, CSS, JS, assets)
- 서버 사이드 로직 없음
- 외부 서비스 연동 없음 (사용자 지정 Prometheus 제외)
- CORS는 Prometheus 서버 설정에 의존

**Scale/Scope**: 단일 사용자 로컬 사용, 동시 쿼리 1개

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 상태 | 검증 내용 |
|------|------|-----------|
| **I. Static Client-Only** | ✅ Pass | Vite로 정적 빌드, GitHub Pages 배포, 서버 로직 없음 |
| **II. Deterministic Visualization** | ✅ Pass | 규칙 기반 시각화 선택 로직, 테스트 가능한 순수 함수 |
| **III. Local-Only Security** | ✅ Pass | LocalStorage만 사용, 외부 전송 없음 |
| **IV. Explicit Error Handling** | ✅ Pass | 모든 오류 상태를 UI에 명시적 표시 |
| **V. Code Quality** | ✅ Pass | TypeScript strict mode, 단일 책임 원칙 |

**Gate Result**: ✅ **PASS** - 모든 헌법 원칙 준수

## Project Structure

### Documentation (this feature)

```text
specs/001-auto-viz/
├── plan.md              # This file
├── research.md          # Phase 0: 기술 결정 및 연구
├── data-model.md        # Phase 1: 데이터 모델 정의
├── quickstart.md        # Phase 1: 개발 시작 가이드
├── contracts/           # Phase 1: API 계약
│   └── prometheus-api.md
└── tasks.md             # Phase 2: 구현 태스크 (별도 명령)
```

### Source Code (repository root)

```text
src/
├── components/          # React UI 컴포넌트
│   ├── DataSource/      # 데이터소스 설정 UI
│   ├── QueryEditor/     # PromQL 입력 및 시간 범위
│   ├── Visualization/   # 차트 렌더링
│   └── common/          # 공통 UI 컴포넌트
├── services/            # 비즈니스 로직
│   ├── prometheus/      # Prometheus API 클라이언트
│   ├── analyzer/        # 데이터 분석 및 시각화 선택
│   └── storage/         # LocalStorage 관리
├── types/               # TypeScript 타입 정의
├── hooks/               # React Custom Hooks
├── utils/               # 유틸리티 함수
├── App.tsx              # 앱 루트 컴포넌트
├── main.tsx             # 엔트리 포인트
└── index.css            # 글로벌 스타일

tests/
├── unit/                # 단위 테스트
│   ├── analyzer/        # 시각화 선택 로직 테스트
│   └── services/        # 서비스 테스트
├── integration/         # 통합 테스트
└── snapshots/           # 스냅샷 테스트 (결정론적 검증)

public/
├── index.html
└── favicon.ico
```

**Structure Decision**: Frontend-only SPA 구조. 백엔드 없이 `src/` 디렉토리에 모든 클라이언트 코드를 배치. `services/` 디렉토리에서 비즈니스 로직을 UI와 분리하여 테스트 용이성 확보.

## Complexity Tracking

> 헌법 위반 없음 - 이 섹션은 비어 있음

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | - | - |
