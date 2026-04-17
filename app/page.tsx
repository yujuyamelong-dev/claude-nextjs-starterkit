import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Shield,
  Palette,
  Code2,
  Layers,
  ArrowRight,
  Github,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Next.js 15 + Turbopack",
    description:
      "최신 Next.js App Router와 Turbopack으로 빠른 개발 환경. React 19와 함께 제공됩니다.",
  },
  {
    icon: Palette,
    title: "TailwindCSS v4",
    description:
      "새로운 CSS-first 설정. tailwind.config.js가 없고 @theme 블록으로 간단하게 커스터마이징합니다.",
  },
  {
    icon: Layers,
    title: "shadcn/ui 컴포넌트",
    description:
      "미리 설치된 12개 이상의 접근 가능한 컴포넌트. Button, Card, Dialog 등을 즉시 사용할 수 있습니다.",
  },
  {
    icon: Code2,
    title: "TypeScript 우선",
    description: "엄격한 TypeScript 5.3 설정으로 전체 프로젝트에 타입 안전성을 제공합니다.",
  },
  {
    icon: Shield,
    title: "다크모드 준비완료",
    description: "next-themes를 통한 시스템 인식 다크모드. 한 번의 클릭으로 전환되고 깜박거림이 없습니다.",
  },
  {
    icon: Star,
    title: "프로덕션 패턴",
    description:
      "기본 Server Components, 필요한 곳에 클라이언트 아일랜드, 올바른 메타데이터 API, RSC 인식 providers.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative border-b bg-gradient-to-b from-background to-muted/30 px-6 py-24 text-center md:py-36">
          <div className="mx-auto max-w-3xl">
            <Badge variant="secondary" className="mb-6 gap-1.5">
              <Zap className="h-3 w-3" />
              Next.js 15 · React 19 · TailwindCSS v4
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              빠르게 구축할 수 있는{" "}
              <span className="text-primary">프로덕션 레디</span> 스타터
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              shadcn/ui, TailwindCSS v4, TypeScript, 다크모드가 포함된 신중하게 만들어진 Next.js
              스타터 킷. 즉시 사용 가능합니다.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2">
                시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub에서 보기
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                시작하는 데 필요한 모든 것
              </h2>
              <p className="text-muted-foreground md:text-lg">
                미리 구성되고, 의견이 있으며, 첫 날부터 프로덕션 준비가 된 상태입니다.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border bg-card transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
              멋진 걸 만들 준비가 되셨나요?
            </h2>
            <p className="mb-8 text-muted-foreground md:text-lg">
              이 스타터를 복제하고 1분 이내에 프로젝트를 실행하세요. 추가 구성이 필요하지 않습니다.
            </p>

            <div className="flex items-center justify-center gap-3 rounded-lg border bg-card px-6 py-4 font-mono text-sm">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <code className="text-foreground">npm run dev</code>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2">
                지금 바로 시작하기
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                문서 읽기
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
