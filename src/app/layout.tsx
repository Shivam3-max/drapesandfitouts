import type { Metadata } from "next";
import { Archivo, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import { LocalBusinessSchema } from "@/components/schema";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Drapes & Fitouts — control light, privacy and comfort",
    template: "%s · Drapes & Fitouts",
  },
  description:
    "We diagnose your space before we sell you a product. Curtains, blinds, Smart Film, carpets and automation for villas, offices, clinics and hotels across the UAE.",
  openGraph: {
    type: "website",
    siteName: "Drapes & Fitouts",
    locale: "en_AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${cormorant.variable} ${plexMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <div className="ambient" aria-hidden="true" />
        <LocalBusinessSchema />
        {children}
      </body>
    </html>
  );
}
