# Invoice Web 개발 로드맵

프리랜서가 Notion에서 작성한 견적서를 클라이언트에게 웹 링크로 공유하고 PDF로 저장할 수 있는 견적서 공유 서비스 MVP.

## 개요

Invoice Web은 **프리랜서 및 1인 사업자**를 위한 **Notion 기반 견적서 공유 및 PDF 다운로드 서비스**로 다음 기능을 제공합니다:

- **Notion 견적서 조회 (F001)**: Notion API를 통해 작성된 견적서를 웹에서 구조화된 UI로 렌더링
- **견적서 목록 관리 (F002)**: 프리랜서 전용 관리 페이지에서 발행된 견적서 목록 확인
- **공유 링크 생성 (F003)**: 견적서별 고유 URL을 클립보드로 복사하여 클라이언트에게 전달
- **PDF 다운로드 (F004)**: 클라이언트가 견적서를 PDF 파일로 저장
- **기본 인증 (F010)**: 환경변수 기반 간단 인증으로 관리 페이지 보호

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅ - 완료
  - See: `/tasks/001-project-setup.md`
  - ✅ Next.js 15 App Router 기반 프로젝트 초기화 (TypeScript, React 19)
  - ✅ 주요 라우트 구조 생성 (`/`, `/invoice/[id]`, `/not-found`)
  - ✅ 루트 레이아웃(`app/layout.tsx`) 구성 (Geist 폰트, 메타데이터)
  - ✅ TailwindCSS v4 설정 (`app/globals.css` CSS-first 방식)
  - ✅ ESLint + TypeScript strict 모드 구성
  - ✅ 경로 별칭 (`@/*`) 및 `components.json` 설정

- **Task 002: 타입 정의 및 데이터 모델 설계** ✅ - 완료
  - See: `/tasks/002-type-definitions.md`
  - ✅ `Invoice` 인터페이스 정의 (id, title, clientName, issuerName, issueDate, dueDate, status, totalAmount, items, notes)
  - ✅ `InvoiceItem` 인터페이스 정의 (id, description, quantity, unitPrice, amount)
  - ✅ Zod 기반 환경변수 스키마 (`NOTION_TOKEN`, `NOTION_DATABASE_ID`) 검증
  - ✅ Notion API 응답 매핑 타입 설계 (`lib/notionClient.ts`)
  - ✅ `.env.example` 파일로 환경변수 템플릿 제공

- **Task 003: 공통 레이아웃 및 테마 시스템 구축** ✅ - 완료
  - See: `/tasks/003-layout-theme.md`
  - ✅ `Header` / `Footer` 레이아웃 컴포넌트 구현 (`components/layout/`)
  - ✅ `next-themes` 기반 다크/라이트 모드 Providers 구성
  - ✅ OKLCH 색상 토큰 및 CSS 변수 정의 (`:root`, `.dark`)
  - ✅ 인쇄 최적화 스타일 베이스 (`@media print`) 준비

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 004: shadcn/ui 기반 공통 컴포넌트 라이브러리 구축** ✅ - 완료
  - See: `/tasks/004-component-library.md`
  - ✅ shadcn/ui New York 스타일 초기화
  - ✅ 핵심 UI 컴포넌트 설치 (button, card, badge, dialog, input, label, separator, sheet, tooltip, dropdown-menu, navigation-menu, avatar)
  - ✅ `cn()` 유틸리티 함수 구현 (`lib/utils.ts`)
  - ✅ lucide-react 아이콘 통합

- **Task 005: 견적서 목록 페이지 UI 구현** ✅ - 완료
  - See: `/tasks/005-invoice-list-ui.md`
  - ✅ 견적서 카드 리스트 UI (`components/invoice/invoice-list.tsx`)
  - ✅ 제목, 클라이언트명, 금액, 작성일, 상태 뱃지 표시
  - ✅ 공유 링크 복사 버튼 UI (클립보드 복사 + 토스트 피드백)
  - ✅ 상세 페이지 미리보기 링크 구성
  - ✅ 반응형 그리드 레이아웃 적용 (모바일 우선)

- **Task 006: 견적서 상세 페이지 UI 구현** ✅ - 완료
  - See: `/tasks/006-invoice-detail-ui.md`
  - ✅ 견적서 상세 뷰 컴포넌트 (`components/invoice/invoice-detail.tsx`)
  - ✅ 발행사 정보 / 클라이언트 정보 헤더 영역 렌더링
  - ✅ 견적 항목 테이블 (설명, 수량, 단가, 금액)
  - ✅ 합계 금액 및 메모 섹션
  - ✅ PDF 다운로드 버튼 UI (인쇄 트리거)
  - ✅ 인쇄 최적화 레이아웃 (여백, 폰트, 컬러)

- **Task 007: 404 오류 안내 페이지 구현** ✅ - 완료
  - See: `/tasks/007-not-found-page.md`
  - ✅ `app/not-found.tsx` 페이지 구성
  - ✅ "요청하신 견적서를 찾을 수 없습니다" 안내 메시지
  - ✅ 홈으로 돌아가기 링크 배치

### Phase 3: 핵심 기능 구현

- **Task 008: Notion API 클라이언트 통합 및 목록 조회 구현** ✅ - 완료
  - See: `/tasks/008-notion-integration.md`
  - ✅ `@notionhq/client` 서버 사이드 클라이언트 구성 (`lib/notionClient.ts`)
  - ✅ 환경변수 스키마 검증 (Zod)
  - ✅ `getInvoices()` 구현 (search API + database_id 필터링)
  - ✅ Notion 페이지 프로퍼티 → `Invoice` 매핑 (한국어/영문 키 호환)
  - ✅ Server Component에서 목록 호출 및 에러 핸들링
  - 🧪 Playwright MCP: 목록 페이지 로딩 / 빈 목록 / 환경변수 누락 시 에러 메시지 검증

- **Task 009: Notion API 단건 조회 및 견적 항목 파싱 구현** ✅ - 완료
  - See: `/tasks/009-notion-detail-fetch.md`
  - ✅ `getInvoice(id)` 함수 구현 (pages.retrieve + blocks.children.list)
  - ✅ Notion 테이블 블록 파싱하여 `InvoiceItem[]` 변환
  - ✅ 존재하지 않는 ID 처리 (null 반환 → 404 페이지)
  - ✅ 상세 페이지 Server Component에서 데이터 로드
  - 🧪 Playwright MCP: 정상 ID 상세 조회 / 잘못된 ID 404 리디렉션 / 항목 0개 케이스 검증

- **Task 010: 공유 링크 생성 및 클립보드 복사 기능 구현** - 우선순위
  - See: `/tasks/010-share-link.md`
  - 견적서별 고유 URL 생성 로직 (`/invoice/[id]`) 정제
  - `navigator.clipboard.writeText()` 기반 복사 (Client Component)
  - 복사 성공/실패 토스트 알림 표시
  - 브라우저 호환성 fallback 처리 (clipboard API 미지원 환경)
  - `NEXT_PUBLIC_APP_URL` 환경변수 기반 절대 URL 생성
  - 🧪 Playwright MCP: 복사 버튼 클릭 → 클립보드 값 검증, 토스트 노출 확인, 다양한 뷰포트에서 UI 검증

- **Task 011: PDF 다운로드 기능 구현**
  - See: `/tasks/011-pdf-download.md`
  - `window.print()` 기반 PDF 저장 흐름 구현
  - `@media print` CSS로 인쇄 전용 레이아웃 최적화 (페이지 여백, 폰트 크기, 컬러 제어)
  - 헤더/푸터/버튼 등 UI 요소 인쇄 시 숨김 처리 (`print:hidden`)
  - A4 규격 기반 페이지 브레이크 처리
  - 필요 시 `html2pdf.js` 대체 구현 검토
  - 🧪 Playwright MCP: PDF 다운로드 버튼 클릭, 인쇄 미리보기 레이아웃 캡처, 주요 요소 가시성 검증

- **Task 012: 환경변수 기반 기본 인증 시스템 구현 (F010)** - 우선순위
  - See: `/tasks/012-basic-auth.md`
  - Next.js `middleware.ts`에서 `/` (목록 페이지) 경로 보호
  - `ADMIN_PASSWORD` 환경변수 기반 HTTP Basic Auth 또는 쿠키 인증 선택 구현
  - 로그인 페이지(또는 Basic Auth 프롬프트) 제공
  - `/invoice/[id]` 경로는 공개 접근 허용 (인증 제외 처리)
  - 인증 실패 시 401 응답 또는 로그인 페이지 리디렉션
  - 🧪 Playwright MCP: 비인증 접근 차단 / 올바른 비밀번호 통과 / 잘못된 비밀번호 거부 / 공개 상세 페이지는 인증 없이 접근 가능 검증

- **Task 013: 핵심 기능 통합 E2E 테스트**
  - See: `/tasks/013-e2e-integration-test.md`
  - Playwright MCP 기반 전체 사용자 플로우 시나리오 작성
  - 프리랜서 플로우: 인증 → 목록 조회 → 링크 복사
  - 클라이언트 플로우: 공유 링크 접근 → 상세 조회 → PDF 다운로드
  - 404 에러 케이스, Notion API 실패 케이스, 빈 목록 케이스 검증
  - 다크모드/라이트모드 전환 시나리오 포함
  - 모바일/데스크톱 반응형 뷰포트 크로스 테스트

### Phase 4: 고급 기능 및 최적화

- **Task 014: 성능 최적화 및 캐싱 전략 적용**
  - See: `/tasks/014-performance-optimization.md`
  - Next.js `fetch` 캐싱 및 `revalidate` 옵션으로 Notion API 호출 최소화
  - Server Component 캐시 활용 (`unstable_cache` 또는 `revalidateTag`)
  - 이미지/폰트 최적화 (`next/image`, `next/font`)
  - Suspense 경계 및 로딩 UI(`loading.tsx`) 도입
  - Turbopack 빌드 성능 측정 및 번들 크기 모니터링

- **Task 015: 에러 핸들링 및 사용자 피드백 강화**
  - See: `/tasks/015-error-handling.md`
  - `error.tsx` 에러 바운더리 페이지 구성 (목록/상세 각각)
  - Notion API 타임아웃/레이트리밋 에러 메시지 사용자 친화적 표시
  - 환경변수 누락 시 개발/운영 환경별 안내 메시지 구분
  - 로그 수집 (Vercel Log Drain 또는 콘솔 기반)
  - 토스트/알림 시스템 통일 (성공/에러/정보)

- **Task 016: SEO, 메타데이터 및 접근성 개선**
  - See: `/tasks/016-seo-accessibility.md`
  - 페이지별 `generateMetadata()` 구현 (상세 페이지는 견적서 제목 기반)
  - Open Graph / Twitter Card 메타 태그
  - `robots.txt` 설정 (목록 페이지 크롤링 차단, 상세 페이지는 공개이나 noindex 권장)
  - WCAG 2.1 AA 수준 접근성 점검 (키보드 내비게이션, ARIA 라벨, 색 대비)
  - `lang="ko"` 및 적절한 시맨틱 HTML 사용 검증

- **Task 017: Vercel 배포 및 CI/CD 구축**
  - See: `/tasks/017-deployment.md`
  - Vercel 프로젝트 연결 및 `main` 브랜치 자동 배포 설정
  - 환경변수 구성 (`NOTION_TOKEN`, `NOTION_DATABASE_ID`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`)
  - Preview 배포를 활용한 PR 단위 검증
  - GitHub Actions 또는 Vercel 내장 훅으로 린트/빌드 검증
  - 배포 후 Playwright MCP 기반 스모크 테스트 시나리오 실행
  - README 및 운영 가이드 문서화 (환경변수, Notion DB 스키마 안내)
