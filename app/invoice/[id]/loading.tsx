// 견적서 상세 페이지 로딩 UI
// Notion API 호출 및 Items Relation 조회 시간이 길 수 있으므로
// 실제 견적서 레이아웃과 동일한 구조의 스켈레톤으로 자연스러운 로딩 경험을 제공합니다

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvoiceLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 인쇄 시 헤더 숨김 */}
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 px-6 py-10 print:p-0">
        <div className="mx-auto max-w-3xl">
          {/* 상단 액션 바: 뒤로 가기 + PDF 저장 버튼 스켈레톤 */}
          <div className="mb-6 flex items-center justify-between print:hidden">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>

          {/* 견적서 본문 카드 */}
          <div className="rounded-lg border bg-card p-8 shadow-sm print:rounded-none print:border-none print:p-0 print:shadow-none">
            {/* 견적서 제목 ("견적서") */}
            <div className="mb-8 text-center">
              <Skeleton className="mx-auto h-8 w-24" />
            </div>

            {/* 발행사 & 클라이언트 정보 영역 */}
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            {/* 발행일, 지급 기한, 상태 메타 정보 */}
            <div className="mb-8 grid grid-cols-3 gap-4 rounded-md bg-muted/40 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            {/* 견적 항목 테이블: 헤더 + 3개 행 */}
            <div className="mb-8">
              {/* 테이블 헤더 */}
              <div className="mb-4 flex justify-between border-b border-border pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {/* 테이블 행 3개 */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-border/50 py-3"
                >
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>

            {/* 합계 금액 영역 */}
            <div className="flex justify-end">
              <div className="w-48">
                <Skeleton className="mb-3 h-px" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* 인쇄 시 푸터 숨김 */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
