// 견적서 상세 페이지 (서버 컴포넌트)
// 특정 견적서를 Notion API로 조회하여 렌더링합니다
// 존재하지 않는 ID는 not-found.tsx로 리다이렉트됩니다

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/notionClient";
import { formatAmount } from "@/lib/format";
import { InvoiceDetail } from "@/components/invoice/invoice-detail";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface InvoicePageProps {
  params: Promise<{ id: string }>;
}

// 동적 메타데이터 생성
// 견적서 제목과 클라이언트명을 기반으로 각 페이지별 고유한 메타데이터를 생성합니다
// 루트 layout.tsx의 title.template에 따라 "견적서 번호 | Invoice Web" 형식으로 표시됩니다
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = await getInvoice(id);

  // 견적서를 찾지 못한 경우 최소한의 메타데이터 반환
  if (!invoice) {
    return {
      title: "견적서를 찾을 수 없음",
      description: "요청하신 견적서를 찾을 수 없습니다.",
      robots: { index: false, follow: false },
    };
  }

  // 견적서 제목 (없으면 기본값 사용)
  const invoiceTitle = invoice.title || "견적서";

  // 클라이언트명 기반 설명문 생성
  const clientPart = invoice.clientName ? `${invoice.clientName} 님을 위한 ` : "";
  const amountPart =
    invoice.totalAmount > 0
      ? ` • 합계 ${formatAmount(invoice.totalAmount)}`
      : "";
  const description = `${clientPart}견적서${amountPart}`;

  // 발행일 기반 추가 설명 (소셜 미디어 공유용)
  const ogDescription = invoice.clientName
    ? `${invoice.clientName} 님을 위한 견적서입니다. 링크를 통해 온라인으로 확인하고 PDF로 저장하세요.`
    : "견적서를 온라인으로 확인하고 PDF로 저장하세요.";

  return {
    // title은 루트 layout.tsx의 template에 의해 "invoiceTitle | Invoice Web"으로 표시됨
    title: invoiceTitle,
    description,
    keywords: [
      "견적서",
      "invoice",
      "공유",
      ...(invoice.clientName ? [invoice.clientName] : []),
    ],
    // 견적서 페이지는 검색엔진 노출 제한 (프라이버시 보호)
    robots: {
      index: false,
      follow: false,
    },
    // Open Graph: 소셜 미디어 공유 시 표시될 정보
    openGraph: {
      title: invoiceTitle,
      description: ogDescription,
      type: "website",
      locale: "ko_KR",
      siteName: "Invoice Web",
    },
    // Twitter Card: X(트위터) 공유 시 표시될 정보
    twitter: {
      card: "summary",
      title: invoiceTitle,
      description: ogDescription,
    },
  };
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { id } = await params;

  // Notion API로 견적서 단건 조회
  const invoice = await getInvoice(id);

  // 견적서가 없으면 404 not-found.tsx로 이동
  if (!invoice) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* 인쇄 시 헤더 숨김 */}
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 px-6 py-10 print:p-0">
        <InvoiceDetail invoice={invoice} />
      </main>
      {/* 인쇄 시 푸터 숨김 */}
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
