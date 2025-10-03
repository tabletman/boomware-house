import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/cart-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boom Warehouse - Quality Used Electronics",
  description: "Your trusted source for quality used computers, electronics, and appliances in Warrensville Heights, OH. Grade A-D condition products with warranties.",
  keywords: "used electronics, used computers, refurbished electronics, Warrensville Heights, Ohio, computer parts, gaming consoles, appliances",
  authors: [{ name: "Boom Warehouse" }],
  creator: "Boom Warehouse",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Boom Warehouse",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Boom Warehouse - Quality Used Electronics",
    description: "Your trusted source for quality used computers, electronics, and appliances",
    siteName: "Boom Warehouse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boom Warehouse - Quality Used Electronics",
    description: "Your trusted source for quality used computers, electronics, and appliances",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
