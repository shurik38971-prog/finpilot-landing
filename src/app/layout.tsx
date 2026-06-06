import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { JsonLdScripts } from "@/components/seo/json-ld-scripts";
import {
  OG_IMAGE_PATH,
  SEO_DESCRIPTION,
  SEO_TITLE,
  SITE_URL,
} from "@/lib/seo/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "FinPilot",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "FinPilot — финансовый GPS для самозанятых",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <JsonLdScripts />
        {children}
      </body>
    </html>
  );
}
