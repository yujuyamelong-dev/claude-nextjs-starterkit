"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatAmount, formatDate } from "@/lib/format";
import type { Invoice } from "@/lib/notionClient";

interface InvoiceDetailProps {
  invoice: Invoice;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* 인쇄 제외 헤더 액션 */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-xl font-semibold text-foreground">견적서</h1>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          PDF 저장
        </Button>
      </div>

      {/* 견적서 본문 (인쇄 영역) */}
      <div className="rounded-lg border bg-card p-8 shadow-sm print:rounded-none print:border-none print:p-0 print:shadow-none">
        {/* 제목 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">견 적 서</h2>
        </div>

        {/* 발행사 & 클라이언트 정보 */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              발행사
            </h3>
            <p className="font-medium text-foreground">{invoice.issuerName || "-"}</p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              수신
            </h3>
            <p className="font-medium text-foreground">{invoice.clientName || "-"}</p>
          </div>
        </div>

        {/* 견적서 메타 정보 */}
        <div className="mb-8 grid grid-cols-3 gap-4 rounded-md bg-muted/40 p-4">
          <div>
            <p className="text-xs text-muted-foreground">견적서 번호</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{invoice.title || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">발행일</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{formatDate(invoice.issueDate)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">지급 기한</p>
            <p className="mt-0.5 text-sm font-medium text-foreground">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* 견적 항목 테이블 */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-semibold text-muted-foreground">항목</th>
                <th className="pb-2 text-right font-semibold text-muted-foreground">수량</th>
                <th className="pb-2 text-right font-semibold text-muted-foreground">단가</th>
                <th className="pb-2 text-right font-semibold text-muted-foreground">금액</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length > 0 ? (
                invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{item.description}</td>
                    <td className="py-3 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-muted-foreground">
                      {formatAmount(item.unitPrice)}
                    </td>
                    <td className="py-3 text-right font-medium text-foreground">
                      {formatAmount(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                    항목이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 합계 */}
        <div className="flex justify-end">
          <div className="w-48">
            <Separator className="mb-3" />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-foreground">합계</span>
              <span className="font-bold text-foreground">{formatAmount(invoice.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* 메모 */}
        {invoice.notes && (
          <div className="mt-8">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              메모
            </h3>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
