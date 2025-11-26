import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "../globals.css";

export const metadata: Metadata = {
	title: "Stratos Admin",
	description: "Admin panel for Stratos",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<ToastProvider />
				</ThemeProvider>
			</body>
		</html>
	);
}
