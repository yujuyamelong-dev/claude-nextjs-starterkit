import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Claude Next.js Starter Kit",
    template: "%s | Claude Next.js Starter Kit",
  },
  description:
    "프로덕션 레디한 Next.js 15 스타터 킷. shadcn/ui, TailwindCSS v4, TypeScript를 포함합니다.",
  keywords: ["Next.js", "React", "TypeScript", "TailwindCSS", "shadcn/ui"],
  authors: [{ name: "Claude" }],
  creator: "Claude",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "Claude Next.js Starter Kit",
    description: "프로덕션 레디한 Next.js 15 스타터 킷",
    siteName: "Claude Next.js Starter Kit",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
