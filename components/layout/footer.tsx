import Link from "next/link";
import { Code2, Github, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="mb-3 flex items-center gap-2 font-semibold text-foreground"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              Starter Kit
            </Link>
            <p className="text-sm text-muted-foreground">
              프로덕션 레디 Next.js 스타터 킷. TailwindCSS v4와 shadcn/ui로 빠르게 시작하세요.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">제품</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  홈
                </Link>
              </li>
              <li>
                <Link href="#docs" className="hover:text-foreground transition-colors">
                  문서
                </Link>
              </li>
              <li>
                <Link href="#components" className="hover:text-foreground transition-colors">
                  컴포넌트
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">리소스</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://nextjs.org"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  Next.js
                </a>
              </li>
              <li>
                <a
                  href="https://ui.shadcn.com"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  shadcn/ui
                </a>
              </li>
              <li>
                <a
                  href="https://tailwindcss.com"
                  className="hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  TailwindCSS
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">커뮤니티</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Claude Next.js Starter Kit. MIT License.</p>
          <p>
            빌드:{" "}
            <a href="https://nextjs.org" className="hover:text-foreground font-medium transition-colors">
              Next.js
            </a>
            {" "}+{" "}
            <a
              href="https://ui.shadcn.com"
              className="hover:text-foreground font-medium transition-colors"
            >
              shadcn/ui
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
