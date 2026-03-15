import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZEDAGRO | Digital Food Reserve Agency Platform",
  description:
    "A comprehensive Digital Food Reserve Agency (FRA) platform modernizing agricultural supply chain management in Zambia — from farmer registration to produce storage.",
  keywords: [
    "Zambia",
    "FRA",
    "agriculture",
    "food reserve",
    "FISP",
    "farmer",
    "digital platform",
  ],
  openGraph: {
    title: "ZEDAGRO | Digital Food Reserve Agency Platform",
    description:
      "Modernizing agricultural supply chain management with digital farmer registration, FISP vouchers, secure payments, and real-time logistics tracking.",
    type: "website",
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
