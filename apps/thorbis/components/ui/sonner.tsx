"use client"

import { Toaster as Sonner } from "sonner";

interface ToasterProps {
	className?: string;
	toastOptions?: Record<string, unknown>;
}

function ToasterComponent({ className = "", toastOptions = {} }: ToasterProps) {
	return (
		<Sonner
			className={className}
			toastOptions={{
				classNames: {
					toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
				...toastOptions,
			}}
		/>
	);
}

export { ToasterComponent as Toaster };
