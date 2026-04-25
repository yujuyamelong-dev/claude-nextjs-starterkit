import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground/40" />
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        요청하신 견적서를 찾을 수 없습니다
      </h1>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        링크가 만료되었거나 잘못된 주소일 수 있습니다. 견적서를 발송한 담당자에게 다시 확인해
        주세요.
      </p>
      <Button asChild variant="outline">
        <Link href="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  );
}
