import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import layoutStyles from "./layout.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaPixel from "@/components/pixel/MetaPixel";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthProvider";
import FloatingCart from "@/components/cart/FloatingCart";
import { getSettings } from "@/lib/settings";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const settings = getSettings();
  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords: settings.seoKeywords,
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: 'https://rudrakshalanka.com', // placeholder domain
      siteName: settings.siteTitle,
      images: [
        {
          url: '/images/hero-bg.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className={layoutStyles.body}>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <MetaPixel />
              <Header />
              <main className={layoutStyles.main}>{children}</main>
              <Footer />
              <FloatingCart />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
