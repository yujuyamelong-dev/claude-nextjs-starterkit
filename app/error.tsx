"use client";

// 목록 페이지 에러 바운더리 (클라이언트 컴포넌트 필수)
// Next.js error.tsx는 반드시 "use client" 지시문을 포함해야 합니다

import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, WifiOff, ServerCrash, RefreshCw } from "lucide-react";

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

  // 환경변수 / 설정 오류
  if (
    message.includes("token") ||
    message.includes("database") ||
    message.includes("설정되지 않았")
  ) {
    return {
      icon: <ServerCrash className="h-6 w-6 shrink-0 text-destructive" />,
      title: "서비스 설정 오류",
      description:
        "서비스 설정에 문제가 있습니다. 관리자에게 문의해 주세요.",
    };
  }

  // 기타 알 수 없는 오류 (기본값)
  return {
    icon: <AlertCircle className="h-6 w-6 shrink-0 text-destructive" />,
    title: "오류가 발생했습니다",
    description:
      "견적서 목록을 불러오는 중에 예상하지 못한 오류가 발생했습니다.",
  };
}

export default function RootError({ error, reset }: ErrorProps) {
  // 에러를 콘솔에 기록하여 개발 환경에서 디버깅을 용이하게 함
  useEffect(() => {
    console.error("[RootError]", error);
  }, [error]);

  const { icon, title, description } = resolveErrorInfo(error);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-4xl">
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
                <Button onClick={reset} className="mt-4 gap-2">
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
