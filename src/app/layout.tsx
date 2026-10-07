import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jet",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fermor.in"),
  title: {
    default: "Fermor — one honest picture of your money",
    template: "%s · Fermor",
  },
  description:
    "Fermor brings your accounts, investments and spending into one clear view, then explains it in plain language. Free India-first calculators, no login wall, no paid recommendations.",
  keywords: [
    "personal finance India",
    "SIP calculator",
    "EMI calculator",
    "money tracking",
    "net worth",
    "Fermor",
  ],
  openGraph: {
    type: "website",
    url: "https://fermor.in",
    siteName: "Fermor",
    title: "Fermor — one honest picture of your money",
    description:
      "Smart financial decisions for India. One clear view of your money, plain-English insights, and free calculators that show their maths.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fermor — one honest picture of your money",
    description:
      "Smart financial decisions for India. Free, transparent calculators and one clear view of your money.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f2",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body
        className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <noscript>
          {/*
            Scroll reveals and split headings are progressive enhancement —
            never hide content. The pinned How-it-works story needs JS to
            advance, so without it we fall back to the static step list.
          */}
          <style>{`.reveal{opacity:1 !important;transform:none !important}.split-line{opacity:1 !important;transform:none !important}.story-pinned{display:none !important}.story-static{display:block !important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
