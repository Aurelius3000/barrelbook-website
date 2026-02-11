import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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
  metadataBase: new URL('https://www.barrelbook.app'),
  title: {
    template: '%s | BarrelBook',
    default: 'BarrelBook — AI-Powered Bourbon Collection App',
  },
  description:
    'Catalog your bourbon and whiskey collection with AI-powered bottle recognition. Scan, organize, and track prices for every bottle in your collection.',
  keywords: [
    'bourbon',
    'whiskey',
    'collection',
    'catalog',
    'AI',
    'bottle scanner',
    'bourbon tracker',
    'whiskey app',
  ],
  openGraph: {
    type: 'website',
    url: 'https://www.barrelbook.app',
    siteName: 'BarrelBook',
    title: 'BarrelBook — AI-Powered Bourbon Collection App',
    description:
      'Catalog your bourbon and whiskey collection with AI-powered bottle recognition. Scan, organize, and track prices for every bottle in your collection.',
    images: [
      {
        url: '/BarrelBook Logo Large.png',
        alt: 'BarrelBook Logo',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BarrelBook — AI-Powered Bourbon Collection App',
    description:
      'Catalog your bourbon and whiskey collection with AI-powered bottle recognition.',
    images: ['/BarrelBook Logo Large.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
