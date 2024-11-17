import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThorbisWrapper } from "../components/ThorbisWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Thorbis",
	description: "Thorbis Analytics Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body className={inter.className}>
				{children}
				<ThorbisWrapper debug={process.env.NODE_ENV === "development"} />
			</body>
		</html>
	);
}
