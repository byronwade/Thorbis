"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSession } from "@/lib/auth/auth-client";

interface AuthGuardProps {
	children: ReactNode;
	redirectTo?: string;
}

/**
 * Auth Guard Component
 *
 * Protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
export function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
	const { data: session, isPending: isLoading } = useSession();
	const isAuthenticated = !!session?.user;
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			const currentPath = window.location.pathname;
			router.push(`${redirectTo}?redirectTo=${encodeURIComponent(currentPath)}`);
		}
	}, [isAuthenticated, isLoading, redirectTo, router]);

	// Show loading spinner while checking auth
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-primary size-8 animate-spin" />
			</div>
		);
	}

	// Don't render children if not authenticated (redirect will happen)
	if (!isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-primary size-8 animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}

/**
 * Guest Guard Component
 *
 * Protects auth pages (login, signup).
 * Redirects to dashboard if user is already authenticated.
 */
export function GuestGuard({ children, redirectTo = "/dashboard" }: AuthGuardProps) {
	const { data: session, isPending: isLoading } = useSession();
	const isAuthenticated = !!session?.user;
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			router.push(redirectTo);
		}
	}, [isAuthenticated, isLoading, redirectTo, router]);

	// Show loading spinner while checking auth
	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-primary size-8 animate-spin" />
			</div>
		);
	}

	// Don't render children if authenticated (redirect will happen)
	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="text-primary size-8 animate-spin" />
			</div>
		);
	}

	return <>{children}</>;
}
