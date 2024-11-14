"use client";

import { Inter } from "next/font/google";
import { NextAuthProvider } from "@/thorbis/components/providers/NextAuthProvider";
import { ThorbisScript } from "@thorbis/events/components";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<NextAuthProvider>{children}</NextAuthProvider>
				<ThorbisScript debug={true} devServerUrl="http://localhost:3001" />
			</body>
		</html>
	);
}
