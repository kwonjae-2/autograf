# Autograf

Prometheus 메트릭 데이터를 위한 **결정론적 자동 시각화** 웹 애플리케이션

## 개요

Autograf는 Prometheus HTTP API에서 가져온 메트릭 데이터를 자동으로 분석하고, 데이터의 구조와 특성에 기반하여 최적의 시각화를 생성하는 정적 웹 애플리케이션입니다.

## 핵심 원칙

- **정적 클라이언트 전용**: GitHub Pages에서 호스팅되는 순수 정적 웹앱
- **결정론적 시각화**: 동일한 입력 → 동일한 시각화 (AI 추천 없음)
- **로컬 전용 보안**: 인증 정보는 브라우저에만 저장, 외부 전송 없음
- **명확한 오류 처리**: 모든 오류 상황을 사용자에게 명시적으로 표시
- **코드 품질**: 가독성, 명확성, 예측 가능성 최우선

## 기술 스택

| 영역 | 기술 |
|------|------|
| **Language** | TypeScript 5.x (strict mode) |
| **Framework** | React 18 |
| **Build Tool** | Vite 5.x |
| **Charts** | Apache ECharts 5.x |
| **State** | TanStack Query + React Context |
| **Styling** | Tailwind CSS 3.x |
| **Testing** | Vitest + React Testing Library |
| **Hosting** | GitHub Pages |

## 프로젝트 상태

🚧 **개발 준비 중** - 태스크 분해 완료

### 현재 진행 상황

| 단계 | 상태 | 설명 |
|------|------|------|
| 헌법 정의 | ✅ 완료 | v1.0.0 비준 |
| 기능 명세 | ✅ 완료 | 001-auto-viz |
| 기술 계획 | ✅ 완료 | Phase 0-1 완료 |
| 태스크 분해 | ✅ 완료 | 88개 태스크 |
| 구현 | ⏳ 대기 | `/speckit.implement` 실행 필요 |

### 태스크 요약

| Phase | 설명 | 태스크 수 |
|-------|------|-----------|
| Phase 1 | Setup (프로젝트 초기화) | 11 |
| Phase 2 | Foundational (핵심 인프라) | 18 |
| Phase 3 | US1 - PromQL 쿼리 및 시각화 (MVP) | 24 |
| Phase 4 | US2 - 데이터소스 설정 | 10 |
| Phase 5 | US3 - 시간 범위 설정 | 7 |
| Phase 6 | US4 - 오류 처리 | 8 |
| Phase 7 | Polish | 10 |
| **Total** | | **88** |

## 프로젝트 구조

```
autograf/
├── .cursor/                    # Cursor IDE 설정
│   ├── commands/               # Speckit 명령어
│   └── rules/                  # Cursor 규칙
├── .specify/                   # 프로젝트 명세 프레임워크
│   ├── memory/
│   │   └── constitution.md     # 프로젝트 헌법 (v1.0.0)
│   ├── scripts/                # 자동화 스크립트
│   └── templates/              # 문서 템플릿
├── specs/                      # 기능 명세서
│   └── 001-auto-viz/           # PromQL 자동 시각화
│       ├── spec.md             # 기능 명세서
│       ├── plan.md             # 구현 계획
│       ├── research.md         # 기술 연구
│       ├── data-model.md       # 데이터 모델
│       ├── quickstart.md       # 개발 시작 가이드
│       ├── tasks.md            # 구현 태스크 (88개)
│       ├── contracts/          # API 계약
│       │   └── prometheus-api.md
│       └── checklists/         # 품질 체크리스트
└── README.md
```

## 문서

### 프로젝트 기반
- [프로젝트 헌법](.specify/memory/constitution.md) - 핵심 원칙 및 거버넌스

### 기능 명세 (001-auto-viz)
- [기능 명세서](specs/001-auto-viz/spec.md) - 사용자 스토리 및 요구사항
- [구현 계획](specs/001-auto-viz/plan.md) - 기술 컨텍스트 및 구조
- [기술 연구](specs/001-auto-viz/research.md) - 기술 결정 및 근거
- [데이터 모델](specs/001-auto-viz/data-model.md) - 엔티티 및 상태 정의
- [개발 시작 가이드](specs/001-auto-viz/quickstart.md) - 프로젝트 설정 방법
- [구현 태스크](specs/001-auto-viz/tasks.md) - 88개 태스크 목록
- [Prometheus API 계약](specs/001-auto-viz/contracts/prometheus-api.md) - API 통합 명세

## 라이선스

MIT License
