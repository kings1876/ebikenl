import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
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
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-bike-tekoop.vercel.app",
  ),
  openGraph: { locale: "nl_NL", type: "website", siteName: "E-BIKE-TEKOOP.NL" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
