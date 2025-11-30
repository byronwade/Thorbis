"use client";

import confetti from "canvas-confetti";
import {
	Loader2,
	PartyPopper,
	Share2,
	Sparkles,
	ArrowRight,
	UserPlus,
	Check,
	Copy,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { joinWaitlist } from "@/actions/waitlist";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function WaitlistForm() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
	const [shareUrl, setShareUrl] = useState("");
	const [referralUrl, setReferralUrl] = useState("");
	const [copied, setCopied] = useState(false);
	const [userEmail, setUserEmail] = useState("");

	// Get the current page URL for sharing (client-side only)
	useEffect(() => {
		if (typeof window !== "undefined") {
			const baseUrl = window.location.origin;
			const waitlistUrl = `${baseUrl}/waitlist`;
			const shareText =
				"Join the Thorbis waitlist for early access to field service management! 🚀";
			setShareUrl(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(waitlistUrl)}`,
			);
		} else {
			// Fallback for SSR
			const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thorbis.com";
			const waitlistUrl = `${baseUrl}/waitlist`;
			const shareText =
				"Join the Thorbis waitlist for early access to field service management! 🚀";
			setShareUrl(
				`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(waitlistUrl)}`,
			);
		}
	}, []);

	// Generate referral URL when user email is set (after successful signup)
	useEffect(() => {
		if (userEmail && typeof window !== "undefined") {
			const baseUrl = window.location.origin;
			// Create referral URL with encoded email as ref parameter
			// Use btoa for browser-compatible base64 encoding
			const refCode = btoa(userEmail.toLowerCase().trim())
				.replace(/\+/g, "-")
				.replace(/\//g, "_")
				.replace(/=/g, "");
			setReferralUrl(`${baseUrl}/waitlist?ref=${refCode}`);
		}
	}, [userEmail]);

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

			// Store email for referral link generation
			setUserEmail(email);

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

	const copyReferralLink = async () => {
		if (!referralUrl) return;

		try {
			await navigator.clipboard.writeText(referralUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	if (success) {
		return (
			<div className="w-full space-y-6 animate-in fade-in-50 zoom-in-95 duration-500">
				{/* Success Icon */}
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 animate-in zoom-in-50 duration-500">
					<PartyPopper className="size-10 text-primary" />
				</div>

				{/* Success Title */}
				<div className="space-y-3 text-center">
					<h2
						className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] bg-clip-text text-transparent"
						style={{
							animation: "shimmer 3s linear infinite",
						}}
					>
						{isAlreadySubscribed
							? "You're already on the list! 🎉"
							: "Welcome to the waitlist! 🎉"}
					</h2>
					<p className="text-base text-muted-foreground max-w-md mx-auto">
						{isAlreadySubscribed ? (
							<>
								You're already subscribed! We'll notify you when we launch with
								exclusive early access.
							</>
						) : (
							<>
								We've sent a confirmation email. Check your inbox! We'll notify
								you as soon as Thorbis launches with priority access.
							</>
						)}
					</p>
				</div>

				{/* Refer a Friend Section */}
				<div className="space-y-4 rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
					<div className="flex items-start gap-3">
						<div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
							<UserPlus className="size-5 text-primary" />
						</div>
						<div className="flex-1 space-y-2">
							<h3 className="font-semibold leading-none">
								Refer a Friend
							</h3>
							<p className="text-sm leading-relaxed text-muted-foreground">
								Share Thorbis with your network. When they join the waitlist, you both move up in priority!
							</p>
						</div>
					</div>

					{/* Referral Link */}
					<div className="flex gap-2">
						<div className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-muted-foreground">
							{referralUrl || "Generating link..."}
						</div>
						<Button
							onClick={copyReferralLink}
							variant="outline"
							size="sm"
							className="shrink-0"
							disabled={!referralUrl || copied}
						>
							{copied ? (
								<>
									<Check className="mr-2 size-4" />
									Copied!
								</>
							) : (
								<>
									<Copy className="mr-2 size-4" />
									Copy
								</>
							)}
						</Button>
					</div>

					{/* Social Share Buttons */}
					<div className="flex gap-3 pt-2">
						<Button asChild variant="outline" className="flex-1" size="sm">
							<Link
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Join me on the Thorbis waitlist for early access to field service management! 🚀")}&url=${encodeURIComponent(referralUrl || "")}`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Share referral link on Twitter"
							>
								<svg
									className="mr-2 size-4"
									fill="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true"
								>
									<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
								</svg>
								Share on Twitter
							</Link>
						</Button>
						<Button asChild variant="outline" className="flex-1" size="sm">
							<Link
								href="https://twitter.com/thorbisllc"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Follow @thorbisllc on Twitter"
							>
								<Share2 className="mr-2 size-4" />
								Follow Us
							</Link>
						</Button>
					</div>
				</div>

				<Button
					className="w-full"
					onClick={() => {
						setSuccess(false);
						setIsAlreadySubscribed(false);
						setError(null);
						setEmail("");
						setName("");
						setUserEmail("");
						setReferralUrl("");
						setCopied(false);
					}}
					variant="ghost"
				>
					{isAlreadySubscribed
						? "Join with Different Email"
						: "Join Another Email"}
				</Button>
			</div>
		);
	}

	return (
		<div className="w-full space-y-6">
			{/* Form Header */}
			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight">
					Reserve Your Spot
				</h2>
				<p className="text-sm text-muted-foreground">
					Get notified when we launch. Early access members get exclusive pricing.
				</p>
			</div>

			{/* Form */}
			<form
				className="space-y-5"
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
						Full Name
					</Label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="John Doe"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						disabled={isLoading}
						className="h-12 text-base"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm font-medium">
						Work Email
					</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="john@yourcompany.com"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						className="h-12 text-base"
					/>
				</div>

				<Button
					className={cn(
						"w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-lg transition-all duration-200",
						!isLoading && "hover:shadow-xl hover:scale-[1.02]"
					)}
					disabled={isLoading || !email || !name}
					type="submit"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							Joining Waitlist...
						</>
					) : (
						<>
							<Sparkles className="mr-2 h-5 w-5" />
							Join the Waitlist
							<ArrowRight className="ml-2 h-4 w-4" />
						</>
					)}
				</Button>

				<p className="text-muted-foreground text-center text-xs leading-relaxed pt-2">
					By joining, you agree to receive product updates. You can
					unsubscribe at any time. We respect your privacy.
				</p>
			</form>
		</div>
	);
}
