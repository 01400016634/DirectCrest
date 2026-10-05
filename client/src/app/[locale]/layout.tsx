import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomepageOverlay from "@/components/storefront/HomepageOverlay";
import { getSettings } from "@/actions/settings";

import Script from 'next/script';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DirectCrest | Source from China. Sell Anywhere.",
  description: "Your premium gateway to direct China sourcing. High-quality products, wholesale prices.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const messages = await getMessages();
  const settingsRes = await getSettings();
  const settings = settingsRes.success ? settingsRes.settings : {};

  return (
    <html lang={locale} className={`${inter.variable} font-sans h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#04060f] text-white">
        <Script id="meshopt-decoder" strategy="beforeInteractive" dangerouslySetInnerHTML={{
          __html: `
            self.ModelViewerElement = self.ModelViewerElement || {};
            self.ModelViewerElement.meshoptDecoderLocation = 'https://cdn.jsdelivr.net/npm/meshoptimizer/meshopt_decoder.js';
          `
        }} />
        <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" strategy="lazyOnload" />
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
      </body>
    </html>
  );
}
