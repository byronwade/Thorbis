import { BotIdClient } from "botid/client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...generateSEOMetadata({
    title: "Modern Business Management Platform",
    description:
      "Thorbis is a modern business management platform designed for service companies. Manage customers, jobs, invoices, equipment, and more with our all-in-one solution.",
    path: "/",
  }),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Thorbis",
  },
};

/**
 * Protected routes for Vercel BotID
 *
 * These routes are protected against bot attacks:
 * - Authentication endpoints (signup, signin)
 * - Password reset
 * - Contact forms
 * - Payment/checkout (future)
 */
const protectedRoutes = [
  // Auth routes
  { path: "/api/auth/signup", method: "POST" as const },
  { path: "/api/auth/signin", method: "POST" as const },
  { path: "/api/auth/forgot-password", method: "POST" as const },
  { path: "/api/auth/reset-password", method: "POST" as const },

  // Future protected routes
  // { path: "/api/contact", method: "POST" as const },
  // { path: "/api/checkout", method: "POST" as const },
  // { path: "/api/subscription", method: "POST" as const },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
