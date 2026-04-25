# Invoice Web

Notion에서 작성한 견적서를 클라이언트가 웹 링크로 즉시 확인하고 PDF로 저장할 수 있는 서비스입니다.

## 프로젝트 개요

**목적**: 프리랜서/1인 사업자가 Notion에서 작성한 견적서를 클라이언트에게 공유 링크로 전달하고, 클라이언트는 별도 계정 없이 웹에서 확인 후 PDF로 저장
**사용자**: 견적서를 발송하는 프리랜서 및 1인 사업자 / 링크를 받아 견적서를 확인하는 클라이언트

## 주요 페이지

1. **견적서 목록** (`/`) - 프리랜서 전용 관리 화면. 발행된 견적서 목록 확인 및 공유 링크 복사
2. **견적서 상세** (`/invoice/[id]`) - 클라이언트용 공개 페이지. Notion 견적서 열람 및 PDF 저장
3. **404 안내** - 존재하지 않는 견적서 접근 시 안내

## 핵심 기능

- **F001** Notion 견적서 조회: Notion API로 견적서 데이터 가져와 렌더링
- **F002** 견적서 목록 조회: Notion 데이터베이스에서 전체 견적서 목록 표시
- **F003** 공유 링크 생성: 견적서별 고유 URL 생성 및 클립보드 복사
- **F004** PDF 다운로드: 브라우저 Print API(`window.print()`)로 PDF 저장

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript 5.6+
- **Styling**: TailwindCSS v4 (설정 파일 없음, `globals.css` 기반)
- **UI Components**: shadcn/ui (New York 스타일)
- **Icons**: Lucide React
- **Notion 연동**: @notionhq/client
- **스키마 검증**: Zod
- **배포**: Vercel

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 아래 항목을 설정합니다:

```env
NOTION_TOKEN=secret_xxxx          # Notion Integration Token
NOTION_DATABASE_ID=xxxx           # 견적서 데이터베이스 ID
ADMIN_PASSWORD=your-password      # 목록 페이지 접근 비밀번호
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어보세요.

### 4. 빌드 및 배포

```bash
npm run build
npm run start
```

## Notion 설정 가이드

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 새 Integration 생성
2. Integration Token 복사 → `NOTION_TOKEN`에 설정
3. 견적서 데이터베이스 열기 → 우측 상단 `...` → `Add connections` → 생성한 Integration 연결
4. 데이터베이스 URL에서 ID 추출 → `NOTION_DATABASE_ID`에 설정

### Notion 데이터베이스 필드 구성

| 필드명 | 타입 | 설명 |
|--------|------|------|
| 제목 (Name) | 제목 | 견적서 제목 |
| 클라이언트 | 텍스트 | 클라이언트명 |
| 발행사 | 텍스트 | 프리랜서/회사명 |
| 발행일 | 날짜 | 견적서 발행일 |
| 지급 기한 | 날짜 | 결제 기한 |
| 상태 | 선택 | 초안 / 발행 |
| 합계 | 숫자 | 총 견적 금액 |
| 메모 | 텍스트 | 추가 안내사항 |

## 개발 명령어

```bash
npm run dev        # 개발 서버 (포트 3000)
npm run build      # 프로덕션 빌드
npm run start      # 빌드된 앱 실행
npm run lint       # ESLint 검사
npm run typecheck  # TypeScript 타입 검사
```

## 프로젝트 구조

```
app/
├── layout.tsx              # 루트 레이아웃 (Geist 폰트, ThemeProvider)
├── page.tsx                # 홈 (견적서 목록, 서버 컴포넌트)
├── not-found.tsx           # 404 안내 페이지
├── globals.css             # TailwindCSS v4 + 색상 토큰 + 인쇄 스타일
├── providers.tsx           # next-themes ThemeProvider
└── invoice/
    └── [id]/
        └── page.tsx        # 견적서 상세 (공개 접근)

components/
├── layout/
│   ├── header.tsx          # 헤더 (다크모드 토글)
│   └── footer.tsx          # 푸터
├── invoice/
│   ├── invoice-list.tsx    # 견적서 목록 카드 + 링크 복사
│   └── invoice-detail.tsx  # 견적서 상세 뷰 + PDF 저장
└── ui/                     # shadcn/ui 컴포넌트

lib/
├── utils.ts                # cn() 유틸리티
└── notionClient.ts         # Notion API 클라이언트 + 타입 정의
```

## 문서

- [PRD 문서](./docs/PRD.md) - 상세 요구사항
- [개발 가이드](./CLAUDE.md) - 개발 지침
