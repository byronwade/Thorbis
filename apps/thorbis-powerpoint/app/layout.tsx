import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Thorbis LLC",
	description: "AI-Driven Platform for Adaptive Web Experiences",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className={`${inter.className} bg-background text-foreground`}>{children}</body>
		</html>
	);
}
