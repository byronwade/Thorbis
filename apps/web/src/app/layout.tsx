import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Suspense } from "react";
import { SkipLink } from "@/components/layout/skip-link";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ZustandHydration } from "@/components/providers/zustand-hydration";
import { SpeculationRules } from "@/components/seo/speculation-rules";
// import { BotIdProvider } from "@/components/security/botid-provider";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import "./globals.css";

// Optimized font loading with next/font for zero CLS
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-sans",
	preload: true,
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-geist-mono",
	preload: true,
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
	],
};

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
		statusBarStyle: "black-translucent",
		title: "Thorbis",
		startupImage: [
			{
				url: "/splash/iphone5_splash.png",
				media:
					"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/iphone6_splash.png",
				media:
					"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/iphoneplus_splash.png",
				media:
					"(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)",
			},
			{
				url: "/splash/iphonex_splash.png",
				media:
					"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
			},
			{
				url: "/splash/iphonexr_splash.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/iphonexsmax_splash.png",
				media:
					"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
			},
			{
				url: "/splash/ipad_splash.png",
				media:
					"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/ipadpro1_splash.png",
				media:
					"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/ipadpro3_splash.png",
				media:
					"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)",
			},
			{
				url: "/splash/ipadpro2_splash.png",
				media:
					"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
			},
		],
	},
	formatDetection: {
		telephone: true,
		date: true,
		address: true,
		email: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${jetbrainsMono.variable}`}
			data-scroll-behavior="smooth"
		>
			<head>
				<SpeculationRules />
			</head>
			<body className="font-sans antialiased">
				<SkipLink />
				<ThemeProvider>
					<ZustandHydration />
					{/* <BotIdProvider /> */}
					<Suspense fallback={null}>
						<AnalyticsProvider>{children}</AnalyticsProvider>
					</Suspense>
					<ToastProvider />
				</ThemeProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
