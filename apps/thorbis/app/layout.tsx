"use client";

import React from "react";
import { Metadata } from "next/types";
import { Inter } from "next/font/google";
import "./globals.css";
import { Thorbis } from "thorbis/events";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
			<Thorbis config={{ appId: "my-app" }} debug={true} />
		</html>
	);
}
