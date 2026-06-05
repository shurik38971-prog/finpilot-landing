import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "FinPilot — Финансовый GPS для самозанятых и фрилансеров",
  description:
    "Узнайте своё финансовое здоровье, получите персональный план действий и быстрее достигайте финансовых целей.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "FinPilot — Финансовый GPS для самозанятых и фрилансеров",
    description:
      "Узнайте своё финансовое здоровье, получите персональный план действий и быстрее достигайте финансовых целей.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
