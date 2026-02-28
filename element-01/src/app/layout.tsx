import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/layout/CartDrawer";
import "./globals.css";

import Providers from "@/Providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Molecular Brand",
  description: "Molecular typography and CSS setup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} font-mono antialiased`}
      >
        <Providers>
          <Navbar />
          <CartDrawer />
          {children}
        </Providers>
      </body>
    </html>
  );
}

