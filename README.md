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

- **호스팅**: GitHub Pages
- **데이터 소스**: Prometheus HTTP API (클라이언트 직접 호출)
- **런타임**: 현대 웹 브라우저

## 프로젝트 상태

🚧 **개발 준비 중** - 기능 명세서 작성 완료

### 현재 진행 상황

| 단계 | 상태 | 설명 |
|------|------|------|
| 헌법 정의 | ✅ 완료 | v1.0.0 비준 |
| 기능 명세 | ✅ 완료 | 001-auto-viz |
| 기술 계획 | ⏳ 대기 | `/speckit.plan` 실행 필요 |
| 구현 | ⏳ 대기 | - |

## 프로젝트 구조

```
autograf/
├── .cursor/                    # Cursor IDE 설정
│   └── commands/               # Speckit 명령어
├── .specify/                   # 프로젝트 명세 프레임워크
│   ├── memory/
│   │   └── constitution.md     # 프로젝트 헌법 (v1.0.0)
│   ├── scripts/                # 자동화 스크립트
│   └── templates/              # 문서 템플릿
├── specs/                      # 기능 명세서
│   └── 001-auto-viz/           # PromQL 자동 시각화
│       ├── spec.md             # 기능 명세서
│       └── checklists/         # 품질 체크리스트
│           └── requirements.md
└── README.md
```

## 문서

- [프로젝트 헌법](.specify/memory/constitution.md) - 핵심 원칙 및 거버넌스
- [기능 명세서](specs/001-auto-viz/spec.md) - PromQL 자동 시각화 상세 명세

## 라이선스

MIT License
