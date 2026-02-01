# Autograf

Prometheus 메트릭 데이터를 위한 **결정론적 자동 시각화** 웹 애플리케이션

## 개요

Autograf는 Prometheus HTTP API에서 가져온 메트릭 데이터를 자동으로 분석하고, 데이터의 구조와 특성에 기반하여 최적의 시각화를 생성하는 정적 웹 애플리케이션입니다.

## 주요 기능

- 🔗 **데이터소스 관리**: Prometheus 서버 연결 정보 저장 및 재사용
- 📝 **PromQL 쿼리**: 텍스트 입력으로 PromQL 쿼리 실행
- ⏱️ **시간 범위 설정**: 다양한 시간 범위 프리셋 및 Step 설정
- 📊 **자동 시각화**: 데이터 타입에 따른 결정론적 차트 선택
  - Matrix (시계열) → Line/Area Chart
  - Vector (인스턴트) → Stat/Bar/Table
  - Scalar → Stat
  - String → Text
- 🔍 **원본 데이터**: JSON 형식으로 원본 쿼리 결과 확인
- ⚠️ **오류 처리**: 연결, 인증, 쿼리, CORS, 타임아웃 오류 명확히 표시

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
| **Build Tool** | Vite 6.x |
| **Charts** | Apache ECharts 5.x |
| **State** | TanStack Query |
| **Styling** | Tailwind CSS 3.x |
| **Testing** | Vitest + React Testing Library |
| **Hosting** | GitHub Pages |

## 빠른 시작

### 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 사용 방법

1. **데이터소스 추가**: 왼쪽 패널에서 "추가" 버튼 클릭
2. **연결 정보 입력**: 이름, Prometheus URL, Bearer 토큰(선택) 입력
3. **연결 테스트**: "연결 테스트" 버튼으로 연결 확인
4. **쿼리 작성**: PromQL 쿼리 입력 (예: `up`, `rate(http_requests_total[5m])`)
5. **시간 범위 설정**: 프리셋 선택 또는 Step 조정
6. **실행**: "실행" 버튼 또는 `Ctrl+Enter`
7. **결과 확인**: 자동 생성된 시각화 및 원본 데이터 확인

## 프로젝트 상태

✅ **구현 완료** - 모든 핵심 기능 구현 (86/88 태스크)

### 구현된 기능

| 기능 | 상태 | 설명 |
|------|------|------|
| 데이터소스 관리 | ✅ | 저장, 편집, 삭제, 연결 테스트 |
| PromQL 쿼리 | ✅ | 쿼리 입력 및 실행 |
| 시간 범위/Step | ✅ | 9개 프리셋, 커스텀 Step |
| 자동 시각화 | ✅ | 결정론적 차트 선택 |
| 오류 처리 | ✅ | 유형별 상세 오류 표시 |
| 원본 데이터 | ✅ | JSON 뷰어 |

### 테스트 현황

- ✅ 13개 단위 테스트 통과
- ✅ 결정론적 시각화 선택 로직 검증
- ✅ 프로덕션 빌드 성공

## 프로젝트 구조

```
autograf/
├── src/
│   ├── components/          # React UI 컴포넌트
│   │   ├── common/          # 공통 컴포넌트 (Button, Input, Error 등)
│   │   ├── DataSource/      # 데이터소스 관리 UI
│   │   ├── QueryEditor/     # 쿼리 편집기, 시간 범위
│   │   └── Visualization/   # 차트, 테이블, 통계
│   ├── services/            # 비즈니스 로직
│   │   ├── prometheus/      # Prometheus API 클라이언트
│   │   ├── analyzer/        # 시각화 선택 로직
│   │   └── storage/         # LocalStorage
│   ├── types/               # TypeScript 타입
│   ├── hooks/               # React Hooks
│   └── utils/               # 유틸리티 (시간, 오류, step)
├── tests/                   # 테스트
├── specs/                   # 기능 명세
└── dist/                    # 빌드 결과물
```

## 시각화 규칙

| 데이터 타입 | 시리즈 수 | 시각화 |
|------------|----------|--------|
| Matrix | 1-10 | Line Chart |
| Matrix | 11+ | Area Chart (Stacked) |
| Vector | 1 | Stat Display |
| Vector | 2-5 | Bar Chart |
| Vector | 6+ | Table |
| Scalar | - | Stat Display |
| String | - | Text |

## 문서

### 프로젝트 기반
- [프로젝트 헌법](.specify/memory/constitution.md) - 핵심 원칙 및 거버넌스

### 기능 명세 (001-auto-viz)
- [기능 명세서](specs/001-auto-viz/spec.md) - 사용자 스토리 및 요구사항
- [구현 계획](specs/001-auto-viz/plan.md) - 기술 컨텍스트 및 구조
- [구현 태스크](specs/001-auto-viz/tasks.md) - 86/88 완료

## 라이선스

MIT License
