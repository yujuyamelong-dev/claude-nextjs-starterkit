import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InvoiceList } from "@/components/invoice/invoice-list";
import { getInvoices } from "@/lib/notionClient";
import type { Invoice } from "@/lib/notionClient";

export default async function HomePage() {
  let invoices: Invoice[] = [];
  let error: string | undefined;

  try {
    invoices = await getInvoices();
  } catch (e) {
    error = e instanceof Error ? e.message : "견적서를 불러오는 중 오류가 발생했습니다.";
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-10 sm:mb-12">
            <h1 className="text-3xl font-bold text-foreground">견적서 목록</h1>
            <p className="mt-2 text-base text-muted-foreground">
              Notion에서 발행된 견적서를 확인하고 공유 링크를 복사하세요.
            </p>
          </div>
          <InvoiceList invoices={invoices} error={error} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
