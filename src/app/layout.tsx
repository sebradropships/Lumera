import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import { getProduct, defaultVariantOf } from "@/lib/product-source";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumera.com";
const description =
  "A bio-collagen gel mask designed to deeply hydrate and leave skin looking smoother, fresher and visibly radiant. A 20-minute glow ritual.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Lumera — Bio-Collagen Gel Face Mask",
    template: "%s · Lumera",
  },
  description,
  keywords: [
    "bio-collagen mask",
    "gel face mask",
    "hydrating face mask",
    "Korean skincare",
    "glow ritual",
    "Lumera",
  ],
  applicationName: "Lumera",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Lumera",
    title: "Lumera — Your Skin's 20-Minute Glow Reset",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumera — Your Skin's 20-Minute Glow Reset",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F4",
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
    brand: { "@type": "Brand", name: "Lumera" },
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider product={product}>
          {children}
          <CartDrawer />
        </CartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      </body>
    </html>
  );
}
