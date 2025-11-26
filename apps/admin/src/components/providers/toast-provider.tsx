"use client";

/**
 * Toast Provider - Sonner Toast Notifications
 *
 * Provides toast notifications across the admin application.
 * Automatically themed to match the current theme (light/dark).
 */

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToastProvider() {
	const { theme } = useTheme();

	return (
		<Toaster
			closeButton
			expand={false}
			offset="72px"
			position="top-right"
			richColors
			theme={theme === "dark" ? "dark" : "light"}
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
		/>
	);
}
