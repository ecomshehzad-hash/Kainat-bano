import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kainatbano.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kainat Bano — Luxury Modest Fashion",
    template: "%s | Kainat Bano",
  },
  description:
    "Kainat Bano is a premium fashion house crafting abayas, formal wear, dresses, hijabs and accessories with hand-finished detail and modern silhouettes.",
  keywords: [
    "Kainat Bano",
    "luxury abayas",
    "premium formal wear",
    "designer hijabs",
    "Pakistani formal dress",
    "modest fashion",
  ],
  openGraph: {
    title: "Kainat Bano — Luxury Modest Fashion",
    description:
      "Premium abayas, formal wear, dresses, hijabs and accessories — hand-finished, made to last.",
    url: siteUrl,
    siteName: "Kainat Bano",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kainat Bano — Luxury Modest Fashion",
    description: "Premium abayas, formal wear, dresses, hijabs and accessories.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-ink text-bone">
        <CartProvider>
          <WishlistProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
