"use client";

import confetti from "canvas-confetti";
import {
	CheckCircle2,
	Loader2,
	Mail,
	PartyPopper,
	Share2,
	Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WaitlistForm() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
	const [shareUrl, setShareUrl] = useState("");

	// Get the current page URL for sharing (client-side only)
	useEffect(() => {
		if (typeof window !== "undefined") {
			const waitlistUrl = window.location.href;
			const shareText =
				"Join the Thorbis waitlist for early access to field service management! 🚀";
			setShareUrl(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(waitlistUrl)}`,
			);
		} else {
			// Fallback for SSR
			const waitlistUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com"}/waitlist`;
			const shareText =
				"Join the Thorbis waitlist for early access to field service management! 🚀";
			setShareUrl(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(waitlistUrl)}`,
			);
		}
	}, []);

	const triggerConfetti = () => {
		// Fire multiple confetti bursts for celebration
		const duration = 3000;
		const animationEnd = Date.now() + duration;
		const defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 10000,
			colors: [
				"#26ccff",
				"#a25afd",
				"#ff5e7e",
				"#88ff5a",
				"#fcff42",
				"#ffa62d",
				"#ff36ff",
			],
		};

		function randomInRange(min: number, max: number) {
			return Math.random() * (max - min) + min;
		}

		// Initial burst from center
		confetti({
			...defaults,
			particleCount: 100,
			origin: { x: 0.5, y: 0.5 },
		});

		// Continuous bursts from sides
		const interval: NodeJS.Timeout = setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});
			confetti({
				...defaults,
				particleCount,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);

		// Cleanup
		setTimeout(() => clearInterval(interval), duration);
	};

	useEffect(() => {
		if (success) {
			// Small delay to ensure state is updated
			const timer = setTimeout(() => {
				triggerConfetti();
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [success]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Don't submit if already successful
		if (success) {
			return;
		}

		setError(null);
		setIsLoading(true);

		try {
			const formData = new FormData(event.currentTarget);
			const result = await joinWaitlist(formData);

			if (!result.success) {
				setError(result.error || "Unable to join waitlist. Please try again.");
				setIsLoading(false);
				return;
			}

			// Check if user was already subscribed
			const alreadySubscribed =
				result.message?.toLowerCase().includes("already") || false;
			setIsAlreadySubscribed(alreadySubscribed);

			// Reset form fields - reset state first (form might unmount after setSuccess)
			setEmail("");
			setName("");
			setIsLoading(false);

			// Set success state - this will persist until user clicks "Join Another Email"
			// Note: Form will unmount after this, so we don't need to call .reset()
			setSuccess(true);
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Something went wrong. Please try again.",
			);
			setIsLoading(false);
		}
	};

	if (success) {
		return (
			<Card className="w-full max-w-xl mx-auto border-2 border-primary/20 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-500">
				<CardHeader className="text-center space-y-3 pb-6">
					<div className="mx-auto mb-3 flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
						<PartyPopper className="size-12 text-primary" />
					</div>
					<CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
						{isAlreadySubscribed
							? "You're already on the list! 🎉"
							: "You're on the list! 🎉"}
					</CardTitle>
					<CardDescription className="text-base">
						{isAlreadySubscribed ? (
							<>
								You're already subscribed to the waitlist! We'll notify you when
								we launch.
							</>
						) : (
							<>
								We'll notify you when we launch. Check your email for a
								confirmation message.
							</>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Social Links - Horizontal */}
					<div className="flex gap-3">
						<Button asChild variant="outline" className="flex-1">
							<Link
								href="https://twitter.com/thorbisllc"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Follow @thorbisllc on Twitter"
							>
								<svg
									className="mr-2 size-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
								Follow
							</Link>
						</Button>
						<Button asChild variant="outline" className="flex-1">
							<Link
								href={shareUrl || "#"}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Share waitlist on Twitter"
							>
								<Share2 className="mr-2 size-4" />
								Share
							</Link>
						</Button>
					</div>

					<Button
						className="w-full"
						onClick={() => {
							setSuccess(false);
							setIsAlreadySubscribed(false);
							setError(null);
							setEmail("");
							setName("");
						}}
						variant="outline"
					>
						{isAlreadySubscribed
							? "Join with Different Email"
							: "Join Another Email"}
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md mx-auto border-2 border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
			<CardHeader className="text-center space-y-2 pb-4">
				<div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
					<Sparkles className="size-8 text-primary animate-pulse" />
				</div>
				<CardTitle className="text-2xl font-bold tracking-tight">
					Join the Waitlist
				</CardTitle>
				<CardDescription className="text-sm">
					Be among the first to access Thorbis. We'll notify you when we launch.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="space-y-4"
					onSubmit={handleSubmit}
					onReset={(e) => {
						// Prevent form reset from clearing success state
						if (success) {
							e.preventDefault();
						}
					}}
				>
					{error && (
						<Alert variant="destructive" className="animate-in fade-in-50">
							<AlertDescription className="text-sm">{error}</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium">
							Name
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Your name"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							disabled={isLoading}
							className="h-10"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium">
							Email
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							className="h-10"
						/>
					</div>

					<Button
						className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg"
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Joining...
							</>
						) : (
							<>
								<Mail className="mr-2 h-4 w-4" />
								Join Waitlist
							</>
						)}
					</Button>

					<p className="text-muted-foreground text-center text-xs pt-1">
						By joining, you agree to receive updates. You can unsubscribe at any
						time.
					</p>
				</form>

				{/* Social Links - Horizontal and Compact */}
				<div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
					<Button asChild variant="outline" className="flex-1" size="sm">
						<Link
							href="https://twitter.com/thorbisllc"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Follow @thorbisllc on Twitter"
						>
							<svg
								className="mr-1.5 size-3.5"
								fill="currentColor"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
							Follow
						</Link>
					</Button>
					<Button asChild variant="outline" className="flex-1" size="sm">
						<Link
							href={shareUrl || "#"}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Share waitlist on Twitter"
						>
							<Share2 className="mr-1.5 size-3.5" />
							Share
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
