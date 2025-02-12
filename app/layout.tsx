/* Import necessary types and components from Next.js */
import type { Metadata } from "next";
/* Import Inter font from Google Fonts */
import { Inter } from "next/font/google";
/* Import global styles */
import "./globals.css";

/* Configure Inter font with Latin subset */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

/* Define metadata for the application */
export const metadata: Metadata = {
  title: "ProNet - Professional Network Management",
  description: "Manage your professional network effectively",
};

/* Root layout component that wraps all pages
 * This component provides the basic HTML structure and applies fonts
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
