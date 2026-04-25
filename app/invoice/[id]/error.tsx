"use client";

// 견적서 상세 페이지 에러 바운더리 (클라이언트 컴포넌트 필수)
// 목록 페이지 에러 바운더리와 별도로 운영하여 에러가 상세 페이지에서만 격리됩니다

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, WifiOff, FileX, ServerCrash, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 에러 메시지에서 사용자 친화적인 원인과 아이콘을 결정하는 함수
function resolveErrorInfo(error: Error): {
  icon: React.ReactNode;
  title: string;
  description: string;
} {
  const message = error.message?.toLowerCase() ?? "";

  // 견적서를 찾을 수 없는 경우
  if (
    message.includes("not found") ||
    message.includes("404") ||
    message.includes("찾을 수 없")
  ) {
    return {
      icon: <FileX className="h-6 w-6 shrink-0 text-destructive" />,
      title: "견적서를 찾을 수 없습니다",
      description:
        "요청하신 견적서가 존재하지 않거나 삭제되었습니다. 링크를 다시 확인해 주세요.",
    };
  }

  // 네트워크/연결 오류
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("econnrefused") ||
    message.includes("econnreset")
  ) {
    return {
      icon: <WifiOff className="h-6 w-6 shrink-0 text-destructive" />,
      title: "네트워크 연결 오류",
      description:
        "인터넷 연결을 확인하거나 잠시 후 다시 시도해 주세요.",
    };
  }

  // Notion API / 서버 오류
  if (
    message.includes("notion") ||
    message.includes("api") ||
    message.includes("서버") ||
    message.includes("500") ||
    message.includes("502") ||
    message.includes("503")
  ) {
    return {
      icon: <ServerCrash className="h-6 w-6 shrink-0 text-destructive" />,
      title: "서버 오류",
      description:
        "Notion 데이터를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }

  // 기타 알 수 없는 오류 (기본값)
  return {
    icon: <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />,
    title: "견적서를 불러올 수 없습니다",
    description:
      "요청하신 견적서를 불러오는 중에 오류가 발생했습니다.",
  };
}

export default function InvoiceError({ error, reset }: ErrorProps) {
  // 에러를 콘솔에 기록하여 개발 환경에서 디버깅을 용이하게 함
  useEffect(() => {
    console.error("[InvoiceError]", error);
  }, [error]);

  const { icon, title, description } = resolveErrorInfo(error);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-1 px-6 py-10 print:p-0">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8">
            <div className="flex items-start gap-4">
              {/* 에러 타입에 맞는 아이콘 */}
              {icon}
              <div className="flex-1">
                {/* 에러 제목 */}
                <h2 className="text-lg font-semibold text-destructive">
                  {title}
                </h2>
                {/* 사용자 친화적 설명 */}
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
                {/* 개발 환경에서만 원본 에러 메시지 표시 */}
                {process.env.NODE_ENV === "development" && error.message && (
                  <p className="mt-3 rounded bg-destructive/10 px-2 py-1 text-xs font-mono text-destructive/80">
                    {error.message}
                  </p>
                )}
                {/* 에러 식별자 (digest) - 서버 에러 추적용 */}
                {error.digest && (
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    오류 코드: {error.digest}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {/* 다시 시도 버튼 */}
                  <Button onClick={reset} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    다시 시도
                  </Button>
                  {/* 목록으로 돌아가기 버튼 */}
                  <Button variant="outline" asChild>
                    <Link href="/" className="flex items-center gap-1.5">
                      <ArrowLeft className="h-4 w-4" />
                      목록으로 돌아가기
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
