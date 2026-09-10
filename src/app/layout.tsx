import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import MetaPixel from "@/components/MetaPixel";
import { getProduct, defaultVariantOf } from "@/lib/product-source";
import { siteUrl } from "@/lib/site";
import "./globals.css";

/**
 * Fallback for Gilroy, which is licensed separately (see globals.css). Outfit is
 * the closest free geometric sans, so the page keeps its proportions whether or
 * not the Gilroy files are installed.
 */
const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const description =
  "A bio-collagen gel mask designed to deeply hydrate and leave skin looking smoother, fresher and visibly radiant. A 40-minute glow ritual.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hoygi — Bio-Collagen Gel Face Mask",
    template: "%s · Hoygi",
  },
  description,
  keywords: [
    "bio-collagen mask",
    "gel face mask",
    "hydrating face mask",
    "Korean skincare",
    "glow ritual",
    "Hoygi",
  ],
  applicationName: "Hoygi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Hoygi",
    title: "Hoygi — Your Skin's 40-Minute Glow Reset",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hoygi — Your Skin's 40-Minute Glow Reset",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF7F9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const product = await getProduct();
  const variant = defaultVariantOf(product);

  // Structured data reflects whatever is actually on sale — live price included.
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    brand: { "@type": "Brand", name: "Hoygi" },
    description,
    category: "Beauty & Personal Care > Skin Care > Face Masks",
    ...(product.images[0] ? { image: product.images[0].src } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (variant.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: siteUrl,
    },
  };

  return (
    <html lang="en" className={sans.variable}>
      <body>
        <CartProvider product={product}>
          {children}
          <CartDrawer />
        </CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <MetaPixel />
      </body>
    </html>
  );
}
