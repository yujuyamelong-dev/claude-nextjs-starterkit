import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Invoice Web",
    template: "%s | Invoice Web",
  },
  description: "Notion 견적서를 웹 링크로 공유하고 PDF로 저장하는 서비스",
  keywords: ["견적서", "invoice", "Notion", "프리랜서", "PDF"],
  authors: [{ name: "Invoice Web" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: "Invoice Web",
    description: "Notion 견적서를 웹 링크로 공유하고 PDF로 저장하는 서비스",
    siteName: "Invoice Web",
  },
  robots: {
    index: false,
    follow: false,
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
