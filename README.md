# Claude Next.js Starter Kit

프로덕션 레디한 Next.js 15 스타터 킷입니다. 최신 기술 스택과 모범 사례를 포함하고 있습니다.

## 기술 스택

- **Next.js 15.5** - App Router, React Server Components
- **React 19** - 최신 React 기능
- **TypeScript 5.3** - 엄격한 타입 체크
- **TailwindCSS v4** - CSS-first 설정 (tailwind.config.js 없음)
- **shadcn/ui** - Radix UI 기반 접근 가능한 컴포넌트
- **lucide-react** - 아이콘 라이브러리
- **next-themes** - 다크모드 지원

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 시작
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

### 3. 프로덕션 빌드
```bash
npm run build
npm run start
```

## 프로젝트 구조

```
claude-nextjs-starterkit/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃 (Geist 폰트)
│   ├── page.tsx             # 홈 페이지
│   ├── globals.css          # TailwindCSS v4 설정
│   └── providers.tsx        # next-themes ThemeProvider
├── components/
│   ├── layout/              # 레이아웃 컴포넌트
│   │   ├── header.tsx       # 헤더 (다크모드 토글, 모바일 메뉴)
│   │   └── footer.tsx       # 푸터
│   └── ui/                  # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── avatar.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx
│       ├── dropdown-menu.tsx
│       ├── navigation-menu.tsx
│       └── tooltip.tsx
├── lib/
│   └── utils.ts            # cn() 유틸리티 함수
├── components.json         # shadcn/ui 설정
├── tsconfig.json           # TypeScript 설정
├── next.config.ts          # Next.js 설정
├── postcss.config.mjs      # PostCSS 설정
└── package.json            # 의존성
```

## 주요 기능

### ✅ TailwindCSS v4 (설정 파일 없음)
- `@import "tailwindcss"` 한 줄로 시작
- `@theme inline { }` 블록으로 색상 토큰 정의
- OKLCH 색상 형식 사용
- `.dark` 클래스로 다크모드 지원

### ✅ shadcn/ui Components
- 12개 이상의 접근 가능한 컴포넌트
- Radix UI 프리미티브 기반
- CSS 변수로 테마 커스터마이징
- TypeScript 완벽 지원

### ✅ 다크모드
- next-themes로 시스템 인식 다크모드
- 페이지 새로고침 시 깜박거림 없음
- Header의 토글 버튼으로 즉시 전환

### ✅ 반응형 디자인
- Tailwind 그리드 시스템
- 모바일 최적화
- 모바일 메뉴 (Sheet 컴포넌트)

### ✅ 최신 패턴
- React Server Components 기본값
- 클라이언트 아일랜드 선택적 배치
- `"use client"` 지시어 최소화
- Metadata API 사용

## 공식 문서 준수

이 스타터 킷은 **2026년 최신 공식 문서**를 100% 준수합니다:

- ✅ [Next.js 15 설치 가이드](https://nextjs.org/docs/app/getting-started/installation)
- ✅ [TailwindCSS v4 + Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- ✅ [shadcn/ui 설치 가이드](https://ui.shadcn.com/docs/installation/next)

## 시작하기

### 새 페이지 추가
```tsx
// app/about/page.tsx
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* 내용 */}
      </main>
      <Footer />
    </>
  );
}
```

### UI 컴포넌트 사용
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>카드 제목</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>클릭하기</Button>
      </CardContent>
    </Card>
  );
}
```

### 색상 커스터마이징
`app/globals.css`의 `:root` 또는 `.dark` 블록에서 CSS 변수를 수정합니다:

```css
:root {
  --primary: oklch(0.5 0.18 260);  /* 파란색 */
  --destructive: oklch(0.577 0.245 27.325);  /* 빨간색 */
}
```

## 개발 팁

### ESLint & TypeScript
```bash
npm run lint
```

### IDE 설정
VS Code에서 TypeScript 버전을 워크스페이스 버전으로 설정하면 자동 완성이 개선됩니다.

### 성능
- Next.js Turbopack은 기본값으로 활성화됨
- 이미지는 Next.js `Image` 컴포넌트 사용
- 번들 크기 최적화: 필요한 컴포넌트만 import

## 라이선스

MIT

## 참고 링크

- [Next.js 문서](https://nextjs.org/docs)
- [React 문서](https://react.dev)
- [TailwindCSS 문서](https://tailwindcss.com)
- [shadcn/ui 문서](https://ui.shadcn.com)
- [Radix UI 문서](https://www.radix-ui.com)
