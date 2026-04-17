# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 환경

- **OS**: Windows 11
- **언어**: TypeScript
- **프레임워크**: Next.js 15 (App Router), React 19
- **CSS**: Tailwind CSS v4 (CSS-first, 설정 파일 없음)
- **UI 라이브러리**: shadcn/ui (Radix UI 기반)
- **아이콘**: lucide-react
- **다크모드**: next-themes

## 자주 사용하는 명령어

```bash
# 개발 서버 시작 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# 린트 검사 (ESLint)
npm run lint
```

## 프로젝트 구조 및 아키텍처

### 디렉토리 구조
```
app/              # Next.js 15 App Router
├── layout.tsx    # 루트 레이아웃 (Geist 폰트, ThemeProvider 적용)
├── page.tsx      # 홈 페이지
├── globals.css   # TailwindCSS v4 스타일 + 색상 토큰
└── providers.tsx # next-themes ThemeProvider (use client)

components/
├── layout/       # Header, Footer 같은 레이아웃 컴포넌트
└── ui/           # shadcn/ui 컴포넌트들 (Button, Card, Dialog 등)

lib/
└── utils.ts      # cn() 유틸함수 (clsx + tailwind-merge)
```

### 핵심 아키텍처 패턴

#### 1. **Server Components 기본값**
- 모든 컴포넌트는 기본적으로 Server Component
- `"use client"` 지시어는 최소한으로만 사용
- Providers 컴포넌트만 `"use client"`로 표시 (next-themes ThemeProvider 필요)

#### 2. **Tailwind CSS v4 (설정 파일 없음)**
- `app/globals.css`에서 `@import "tailwindcss"`로 시작
- `@theme inline { }` 블록으로 색상 토큰 정의 (CSS 변수 참조)
- `:root`와 `.dark` 선택자에서 OKLCH 색상 형식 사용
- 다크모드: `.dark` 클래스가 `<html>` 요소에 적용됨
- TailwindCSS 설정 파일(tailwind.config.js/ts)은 없음

#### 3. **다크모드 구현**
- `next-themes`로 시스템 인식 다크모드 처리
- `suppressHydrationWarning` (layout.tsx)으로 깜박거림 방지
- Header 컴포넌트의 토글 버튼으로 테마 전환
- CSS 변수로 밝은/어두운 배색 정의

#### 4. **shadcn/ui 컴포넌트**
- Radix UI 프리미티브 + Tailwind CSS 스타일
- CSS 변수로 테마 커스터마이징 가능
- `components.json`에 정의된 aliases로 import
- New York 스타일 사용

#### 5. **경로 별칭 (Path Alias)**
- `@/*` → 프로젝트 루트
- `@/components` → components 디렉토리
- `@/lib/utils` → utils 파일
- `@/ui` → shadcn/ui 컴포넌트

### TypeScript 설정

- **컴파일 타겟**: ES2017
- **모드**: strict 모드 활성화
- **JSX**: preserve (Next.js에서 처리)
- **모듈**: esnext + bundler 해석
- **강제사항**: `any` 타입 사용 금지

### ESLint 설정

- `next/core-web-vitals`: Next.js 성능 최적화 규칙
- `next/typescript`: TypeScript 관련 규칙
- 별도의 커스텀 규칙은 없음

## 페이지 및 라우팅 추가

새 페이지를 추가하려면 `app/` 디렉토리에 새 폴더를 생성하고 `page.tsx` 파일을 만듭니다.

```tsx
// app/about/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* 콘텐츠 */}
      </main>
      <Footer />
    </>
  );
}
```

## 메타데이터 설정

`app/layout.tsx`에서 `Metadata` 객체를 export하여 SEO 및 Open Graph 설정:

```tsx
export const metadata: Metadata = {
  title: "페이지 제목",
  description: "설명",
  keywords: ["키워드"],
  openGraph: { /* ... */ },
};
```

## 색상 커스터마이징

`app/globals.css`의 `:root` 또는 `.dark` 선택자에서 OKLCH 색상 값 수정:

```css
:root {
  --primary: oklch(0.5 0.18 260);  /* 파란색 */
  --destructive: oklch(0.577 0.245 27.325);  /* 빨간색 */
}
```

CSS 변수는 `@theme inline { }` 블록과 컴포넌트에서 자동으로 참조됩니다.

## 언어 및 커뮤니케이션 규칙

- **기본 응답 언어**: 한국어
- **코드 주석**: 한국어 (변수/함수명은 영어)
- **커밋 메시지**: 한국어
- **문서화**: 한국어

## 코딩 스타일

- **들여쓰기**: 2칸
- **네이밍**: camelCase (함수/변수), PascalCase (컴포넌트)
- **TypeScript**: strict 모드, any 타입 금지
- **반응형**: 모바일 우선, Tailwind 반응형 클래스 사용

## 주요 의존성

| 패키지 | 용도 |
|-------|------|
| `next` | React 프레임워크 + App Router |
| `react` / `react-dom` | UI 라이브러리 |
| `next-themes` | 다크모드 관리 |
| `tailwindcss` | CSS 프레임워크 |
| `@radix-ui/*` | 접근성 있는 UI 프리미티브 |
| `shadcn` | shadcn/ui 컴포넌트 설치 도구 |
| `lucide-react` | 아이콘 라이브러리 |
| `geist` | Vercel Geist 폰트 |
| `clsx` / `tailwind-merge` | className 유틸리티 |

## 일반적인 작업 흐름

### 1. 새 UI 컴포넌트 추가

기존 shadcn/ui 컴포넌트를 사용하거나, `components/ui/` 디렉토리에 새 컴포넌트 추가:

```tsx
// components/ui/custom-component.tsx
import { cn } from "@/lib/utils";

interface CustomComponentProps {
  className?: string;
}

export function CustomComponent({ className }: CustomComponentProps) {
  return <div className={cn("base-styles", className)}>Content</div>;
}
```

### 2. 페이지 콘텐츠 생성

Server Component에서 데이터 페칭을 수행하고, 상호작용이 필요한 부분만 Client Component로 분리:

```tsx
// 서버 컴포넌트 (기본값)
export default async function DataPage() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// 클라이언트 컴포넌트 (필요시에만)
"use client";
function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return {/* ... */};
}
```

### 3. 스타일링

- Tailwind CSS 클래스 조합
- `cn()` 함수로 동적 클래스 병합
- CSS 변수로 다크모드 자동 지원

```tsx
<div className={cn(
  "px-4 py-2",
  isActive && "bg-primary text-primary-foreground"
)}>
  {/* 콘텐츠 */}
</div>
```

## 성능 팁

- **Turbopack**: Next.js 15가 기본값으로 Turbopack 사용 (더 빠른 빌드)
- **Dynamic Imports**: 큰 컴포넌트는 `dynamic()` import로 분할
- **Image Optimization**: `next/image` 사용 (자동 최적화)
- **CSS**: Tailwind의 purge로 사용하지 않는 스타일 제거

## 주의사항

- **`any` 타입 금지**: 항상 명확한 타입 정의
- **Server Component 기본값**: 필요한 곳에만 `"use client"` 사용
- **TailwindCSS v4**: 설정 파일 없음, `globals.css`에서만 커스터마이징
- **React 19**: 최신 기능 활용 (Server Actions 등)
