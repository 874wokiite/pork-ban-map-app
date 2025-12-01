import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP, Zen_Old_Mincho, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  subsets: ["latin"],
  weight: ["400"],
});

const zenMaruGothic = Zen_Maru_Gothic({
  variable: "--font-zen-maru-gothic",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pork-ban-map-kobe-app.netlify.app"),
  title: "神戸豚饅マップ",
  description: "神戸の名物・豚饅の名店を地図で探せる！各店舗の場所や特徴をチェックして、お気に入りの一軒を見つけよう。",
  icons: {
    icon: "/icons/ban-logo.svg",
    shortcut: "/icons/ban-logo.svg",
    apple: "/icons/ban-logo.svg",
  },
  openGraph: {
    title: "神戸豚饅マップ",
    description: "神戸の名物・豚饅の名店を地図で探せる！各店舗の場所や特徴をチェックして、お気に入りの一軒を見つけよう。",
    url: "https://pork-ban-map-kobe-app.netlify.app",
    siteName: "神戸豚饅マップ",
    images: [
      {
        url: "https://pork-ban-map-kobe-app.netlify.app/images/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "神戸豚饅マップ",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "神戸豚饅マップ",
    description: "神戸の名物・豚饅の名店を地図で探せる！各店舗の場所や特徴をチェックして、お気に入りの一軒を見つけよう。",
    images: ["https://pork-ban-map-kobe-app.netlify.app/images/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable} ${zenOldMincho.variable} ${zenMaruGothic.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
