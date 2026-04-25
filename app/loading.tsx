// 홈(목록) 페이지 로딩 UI
// Next.js loading.tsx는 Suspense 기반으로 자동으로 스트리밍 로딩을 처리합니다
// 데이터 페칭 중에 이 컴포넌트가 표시되어 사용자에게 로딩 피드백을 제공합니다

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          {/* 페이지 헤더 영역 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">견적서 목록</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Notion에서 발행된 견적서를 확인하고 공유 링크를 복사하세요.
            </p>
          </div>

          {/* 견적서 카드 스켈레톤 - 실제 카드 레이아웃과 동일한 구조로 구성 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
                {/* 카드 상단: 견적서 번호 + 상태 배지 */}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <Skeleton className="h-5 flex-1 max-w-xs" />
                  <Skeleton className="h-5 w-20" />
                </div>
                {/* 카드 하단: 클라이언트명, 날짜, 금액 + 버튼 */}
                <div className="space-y-3">
                  <Skeleton className="h-4 max-w-xs" />
                  <Skeleton className="h-4 max-w-xs" />
                  <Skeleton className="h-4 max-w-xs" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
