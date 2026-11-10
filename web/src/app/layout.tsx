import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "E-BIKE-TEKOOP.NL | Nieuwe elektrische fietsen van A-merken",
    template: "%s | E-BIKE-TEKOOP.NL",
  },
  description:
    "Nieuwe elektrische fietsen van A-merken met fabrieksgarantie en snelle levering. Betaal met iDEAL, bankoverschrijving of crypto.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-bike-tekoop.nl",
  ),
  openGraph: { locale: "nl_NL", type: "website", siteName: "E-BIKE-TEKOOP.NL" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
