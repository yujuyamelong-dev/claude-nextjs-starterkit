"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, ExternalLink, FileText, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatAmount, formatDate } from "@/lib/format";
import type { Invoice } from "@/lib/notionClient";

interface InvoiceListProps {
  invoices?: Invoice[];
  error?: string;
}

// 상태 배지 색상
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "발행":
    case "Published":
      return "default";
    case "초안":
    case "Draft":
      return "secondary";
    default:
      return "outline";
  }
}

interface CopyButtonProps {
  invoiceId: string;
}

function CopyLinkButton({ invoiceId }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const appUrl = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
      : '';
    const url = `${appUrl}/invoice/${invoiceId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          링크 복사
        </>
      )}
    </Button>
  );
}

export function InvoiceList({ invoices = [], error }: InvoiceListProps) {
  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Notion API 토큰을 확인하고 .env.local 파일에 설정해주세요.
          </p>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">견적서가 없습니다</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Notion 데이터베이스에서 견적서를 작성하면 여기에 표시됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1 text-base">{invoice.title || "제목 없음"}</CardTitle>
              <Badge variant={getStatusVariant(invoice.status)} className="shrink-0 text-xs">
                {invoice.status || "상태 없음"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 견적서 정보 */}
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="line-clamp-1">{invoice.clientName || "-"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 shrink-0" />
                <span className="font-medium text-foreground">{formatAmount(invoice.totalAmount)}</span>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-1">
              <CopyLinkButton invoiceId={invoice.id} />
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link href={`/invoice/${invoice.id}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5" />
                  미리보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
