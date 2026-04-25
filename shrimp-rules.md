# Invoice Web - 개발 규칙 (AI 에이전트용)

## 프로젝트 개요

**Invoice Web**은 Notion에서 작성한 견적서를 웹 링크로 공유하고 PDF로 저장할 수 있는 Next.js 15 기반의 프리랜서용 견적서 공유 서비스입니다.

### 기술 스택

| 항목 | 사용 기술 |
|------|----------|
| 프레임워크 | Next.js 15 (App Router) |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS v4 (설정 파일 없음) |
| UI 컴포넌트 | shadcn/ui (Radix UI 기반) |
| 다크모드 | next-themes |
| 아이콘 | lucide-react |
| 타입스크립트 | strict 모드 |
| 데이터 소스 | Notion API (@notionhq/client) |

---

## 아키텍처 규칙

### 1. Server Component 기본값

**규칙:**
- 모든 컴포넌트는 기본적으로 **Server Component**
- `"use client"` 지시어는 **반드시 필요한 경우에만** 사용
- 상호작용(state, event listener)이 필요한 경우만 분리

**예시:**
```typescript
// ✅ 올바름: Server Component (데이터 페칭)
export default async function HomePage() {
  const invoices = await fetchInvoices();
  return <InvoiceList invoices={invoices} />;
}

// ❌ 잘못됨: 불필요한 use client
"use client";
export default function HomePage() {
  const invoices = await fetchInvoices(); // 서버 함수는 사용 불가
}
```

### 2. 다크모드 구현

**규칙:**
- `next-themes` 라이브러리를 통해서만 다크모드 처리
- `app/layout.tsx`에 `suppressHydrationWarning` 필수 (깜박거림 방지)
- CSS 변수로 밝은/어두운 색상 정의
- Header 컴포넌트의 토글 버튼으로 테마 전환

**수정 포인트:**
- `app/layout.tsx` - `suppressHydrationWarning` 추가
- `app/providers.tsx` - ThemeProvider 래퍼 (use client)
- `app/globals.css` - `:root`와 `.dark` 선택자에서 색상 정의

---

## Tailwind CSS v4 규칙

### 설정 파일 없음

**규칙:**
- `tailwind.config.js` / `tailwind.config.ts` 파일 **없음**
- 모든 스타일 커스터마이징은 `app/globals.css`에서만 수행
- `@import "tailwindcss"` 로 시작하는 CSS-first 방식

**색상 정의 방식:**
```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  --primary: oklch(0.5 0.18 260);
  --destructive: oklch(0.577 0.245 27.325);
}

:root {
  --primary: oklch(0.5 0.18 260);
  --secondary: oklch(0.6 0.15 280);
}

.dark {
  --primary: oklch(0.6 0.12 260);
  --secondary: oklch(0.5 0.10 280);
}
```

**규칙:**
- 색상 값은 **OKLCH 형식** 사용
- `@theme inline { }` 블록과 `:root` / `.dark`에서 동시 정의
- 새로운 색상 토큰은 `globals.css`에 추가 후 컴포넌트에서 `bg-primary`, `text-primary-foreground` 등으로 사용

---

## 디렉토리 구조 및 파일 규칙

### app/ 디렉토리

```
app/
├── layout.tsx              # 루트 레이아웃 (반드시 suppressHydrationWarning, ThemeProvider 포함)
├── providers.tsx           # next-themes ThemeProvider (use client 필수)
├── page.tsx                # 홈 (견적서 목록, Server Component)
├── globals.css             # Tailwind v4 + 색상 토큰 + 인쇄 스타일 (유일한 CSS 커스터마이징 포인트)
├── not-found.tsx           # 404 페이지
└── invoice/
    └── [id]/
        └── page.tsx        # 견적서 상세 (동적 라우트, Server Component)
```

**규칙:**
- `app/layout.tsx`와 `app/providers.tsx`는 **함께 수정**되어야 함 (ThemeProvider 의존성)
- `app/globals.css`는 **유일한 CSS 커스터마이징 포인트**
- 새 페이지 추가 시 `app/[feature]/page.tsx` 구조 유지

### components/ 디렉토리

```
components/
├── layout/                 # 레이아웃 컴포넌트
│   ├── header.tsx          # 헤더 (다크모드 토글 포함)
│   └── footer.tsx          # 푸터
├── invoice/                # 견적서 관련 컴포넌트
│   ├── invoice-list.tsx    # 견적서 목록 카드 + 링크 복사
│   └── invoice-detail.tsx  # 견적서 상세 + PDF 저장
└── ui/                     # shadcn/ui 컴포넌트 (절대 수정 금지)
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── ... (기타 shadcn/ui)
```

**규칙:**
- `components/ui/`의 shadcn/ui 컴포넌트는 **수정하지 않음** (설정 변경 필요 시 재설치)
- `components/layout/`은 모든 페이지에서 공유되는 컴포넌트
- `components/invoice/`는 견적서 기능의 핵심 - 구조 변경 시 신중

### lib/ 디렉토리

```
lib/
├── utils.ts                # cn() 유틸 (clsx + tailwind-merge)
└── notionClient.ts         # Notion API 클라이언트 + Invoice 타입 정의
```

**규칙:**
- `notionClient.ts`는 **Notion 데이터의 유일한 진입점**
- Notion API 호출은 반드시 이 파일을 경유
- Invoice 타입 정의는 이 파일에서만 수행

---

## TypeScript 규칙

**규칙:**
- `tsconfig.json`은 `strict: true`
- **`any` 타입 절대 금지** - 항상 명확한 타입 정의 필수
- `@ts-ignore` / `@ts-nocheck` 주석 **금지**
- unknown 타입 사용 시 type guard로 타입 좁히기

**예시:**
```typescript
// ❌ 금지됨
const data: any = response;

// ✅ 올바름
interface InvoiceResponse {
  id: string;
  amount: number;
}
const data: InvoiceResponse = response;
```

---

## 한국어 규칙

**규칙:**
- **커밋 메시지**: 한국어 작성
- **코드 주석**: 한국어 작성 (변수/함수명은 영어 유지)
- **문서화**: 한국어 작성

**예시:**
```typescript
// ✅ 올바름
// 견적서 목록을 가져오는 함수
async function fetchInvoices() {
  return notionClient.query(...);
}

// ❌ 잘못됨
// fetch invoices from notion
async function fetchInvoices() {
  return notionClient.query(...);
}
```

---

## 다중 파일 수정 규칙 (동기화 필수)

### 1. 레이아웃 변경 시

파일 변경 시 **반드시 함께 수정**:
- `app/layout.tsx` - 메타데이터, suppressHydrationWarning
- `app/providers.tsx` - ThemeProvider 래핑

### 2. 색상/스타일 변경 시

`app/globals.css` 수정 후 **동기화 확인**:
- `:root` (밝은 모드) - 색상 값 수정
- `.dark` (어두운 모드) - 색상 값 수정
- `@theme inline { }` - 색상 토큰 정의

### 3. 견적서 UI 변경 시

`components/invoice/` 수정 시 **영향 범위 확인**:
- `invoice-list.tsx` - 목록 표시 로직
- `invoice-detail.tsx` - 상세 표시 로직
- `lib/notionClient.ts` - 데이터 타입 (필요 시)

---

## API 및 데이터 규칙

### Notion 데이터 접근

**규칙:**
- 모든 Notion 쿼리는 `lib/notionClient.ts`를 경유
- 서버 컴포넌트에서만 호출 가능 (클라이언트 컴포넌트에서 직접 호출 금지)
- 데이터 타입은 `notionClient.ts`의 Invoice 인터페이스로 정의

**패턴:**
```typescript
// app/page.tsx (Server Component)
import { notionClient } from "@/lib/notionClient";

export default async function HomePage() {
  const invoices = await notionClient.query(...);
  return <InvoiceList invoices={invoices} />;
}
```

### 환경 변수

**규칙:**
- `.env.local`, `.env` 파일은 **절대 git 커밋하지 않음**
- `.env.example` 파일만 커밋 (예시 값 포함)
- Notion API key는 `.env.local`에서만 관리

---

## shadcn/ui 컴포넌트 규칙

**규칙:**
- 설치된 shadcn/ui 컴포넌트는 `components/ui/` 디렉토리에만 위치
- 기존 shadcn/ui 컴포넌트 수정 금지 (필요 시 재설치)
- 커스텀 컴포넌트는 `components/` 최상위 또는 기능별 하위 디렉토리에 작성

**CSS 변수 활용:**
shadcn/ui는 CSS 변수로 테마화됨 - `globals.css`의 색상 정의로 자동 적용

---

## 경로 별칭 (Path Alias) 규칙

**사용 가능한 별칭:**
```typescript
"@/*" → 프로젝트 루트
"@/components" → components/ 디렉토리
"@/lib" → lib/ 디렉토리
"@/ui" → components/ui/ (shadcn/ui)
```

**규칙:**
- 절대 경로로 import 작성 (상대 경로 금지)
- 예: `import { cn } from "@/lib/utils"` ✅

---

## 금지 사항 (Strictly Prohibited)

| 항목 | 이유 | 대안 |
|------|------|------|
| `any` 타입 사용 | Type safety 저하 | 명확한 타입 정의 |
| `@ts-ignore` / `@ts-nocheck` | 타입 에러 무시 | 타입 문제 근본 해결 |
| `tailwind.config.js` 생성 | Tailwind v4는 설정 파일 미사용 | `globals.css`에서만 수정 |
| 클라이언트 컴포넌트에서 Notion 쿼리 | 보안 및 성능 문제 | `notionClient.ts`를 Server Component에서만 사용 |
| shadcn/ui 컴포넌트 직접 수정 | 패키지 관리 복잡성 | 필요 시 재설치 또는 wrapper 컴포넌트 작성 |
| `.env` / `.env.local` 커밋 | 보안 위험 (API key 노출) | `.env.example` 만 커밋 |
| 상대 경로 import | 코드 이동 시 경로 깨짐 | 절대 경로 별칭 사용 (@/) |
| 동기 API 남용 | 성능 저하 | 비동기 처리 (async/await) |

---

## AI 의사결정 기준

### 1. 새 페이지 추가 시

1. `app/[feature]/page.tsx` 구조 생성
2. Header, Footer 포함 여부 판단
3. 데이터 필요 시 `notionClient.ts` 경유

### 2. 새 컴포넌트 추가 시

1. 상호작용 필요 여부 → Server/Client 결정
2. UI 기본값 제공 여부 → shadcn/ui 조회
3. 위치 결정 → `components/[category]/`

### 3. 스타일 변경 시

1. 색상 토큰 수정 → `globals.css`의 `:root` / `.dark`
2. 클래스명 수정 → Tailwind 클래스 사용
3. 다크모드 테스트 필수

### 4. Notion 데이터 스키마 변경 시

1. `lib/notionClient.ts`의 Invoice 타입 업데이트
2. 쿼리 로직 수정
3. 기존 데이터와의 호환성 검토

---

## 커밋 메시지 규칙

**형식:**
```
[타입] 설명

상세 내용 (필요 시)
```

**타입:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `refactor`: 구조 변경 (기능 무변화)
- `style`: 스타일/CSS 변경
- `docs`: 문서화
- `chore`: 빌드, 의존성 등

**예시:**
```
feat: 견적서 목록 검색 기능 추가

사용자가 견적서 제목으로 검색할 수 있도록 구현
- InvoiceList 컴포넌트에 검색 입력 필드 추가
- notionClient에서 필터링 로직 구현
```

---

## 테스트 및 검증 규칙

**필수 검증:**
- 모든 페이지는 밝은 모드, 어두운 모드 모두 테스트
- 반응형 레이아웃 검증 (모바일, 태블릿, 데스크톱)
- TypeScript 컴파일 확인 (`npm run typecheck`)
- ESLint 검증 (`npm run lint`)

---

## 실행 절차

### 개발 시작

```bash
npm run dev  # 포트 3000에서 개발 서버 시작
```

### 배포 전

```bash
npm run typecheck  # TypeScript 타입 검사
npm run lint       # ESLint 검사
npm run build      # 프로덕션 빌드
npm start          # 빌드된 앱 실행
```
