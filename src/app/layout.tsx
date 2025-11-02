import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { BotIdClient } from "botid/client";
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
  title: "Thorbis | Modern Business Platform",
  description:
    "Manage your business with Thorbis - a modern, dark-first platform",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Stratos",
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
