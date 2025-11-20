"use client";

import { AlertCircle, CheckCircle2, ImageUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { completeProfile } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StandardFormField } from "@/components/ui/standard-form-field";

const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

type CompleteProfileFormProps = {
	existingName: string;
	existingPhone: string;
	existingAvatar: string | null;
	userEmail: string;
};

export function CompleteProfileForm({
	existingName,
	existingPhone,
	existingAvatar,
	userEmail,
}: CompleteProfileFormProps) {
	const router = useRouter();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(
		existingAvatar,
	);
	const [hasChangedAvatar, setHasChangedAvatar] = useState(false);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		return () => {
			// Only revoke if it's a local blob URL (not an external OAuth URL)
			if (avatarPreview?.startsWith("blob:")) {
				URL.revokeObjectURL(avatarPreview);
			}
		};
	}, [avatarPreview]);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		setAvatarError(null);

		if (!file) {
			// If user clears the file input, revert to OAuth avatar or null
			if (avatarPreview?.startsWith("blob:")) {
				URL.revokeObjectURL(avatarPreview);
			}
			setAvatarPreview(existingAvatar);
			setHasChangedAvatar(false);
			return;
		}

		if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
			setAvatarError("Please upload a JPG, PNG, or WebP image.");
			event.target.value = "";
			return;
		}

		if (file.size > MAX_AVATAR_BYTES) {
			setAvatarError("Profile images must be smaller than 5MB.");
			event.target.value = "";
			return;
		}

		// Clean up previous blob URL if it exists
		if (avatarPreview?.startsWith("blob:")) {
			URL.revokeObjectURL(avatarPreview);
		}
		setAvatarPreview(URL.createObjectURL(file));
		setHasChangedAvatar(true);
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		setAvatarError(null);
		setIsLoading(true);

		try {
			const formData = new FormData(event.currentTarget);
			const result = await completeProfile(formData);

			if (!result.success) {
				setError(result.error || "Unable to update your profile right now.");
				setIsLoading(false);
				return;
			}

			// Redirect to onboarding/dashboard
			router.push("/dashboard/welcome");
		} catch (caughtError) {
			setError(
				caughtError instanceof Error
					? caughtError.message
					: "Something went wrong. Please try again.",
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="flex w-full max-w-lg flex-col gap-6">
			{/* Logo */}
			<div className="flex items-center gap-3">
				<Image
					alt="Thorbis Logo"
					className="size-8.5"
					height={34}
					src="/ThorbisLogo.webp"
					width={34}
				/>
				<span className="text-xl font-semibold">Thorbis</span>
			</div>

			{/* Welcome Text */}
			<div>
				<h2 className="mb-1.5 text-2xl font-semibold">Complete your profile</h2>
				<p className="text-muted-foreground">
					We need a few more details to get your account set up
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Info Alert */}
			<Alert>
				<CheckCircle2 className="h-4 w-4" />
				<AlertDescription>
					You signed in with <strong>{userEmail}</strong>. Just a few more
					details and you're all set!
				</AlertDescription>
			</Alert>

			{/* Profile Completion Form */}
			<form
				className="space-y-6"
				encType="multipart/form-data"
				onSubmit={handleSubmit}
			>
				{/* Name Field (if missing) */}
				{!existingName && (
					<StandardFormField
						label="Full name"
						htmlFor="name"
						description="This will be displayed on your profile and in communications"
						required
					>
						<Input
							autoComplete="name"
							autoFocus
							disabled={isLoading}
							id="name"
							name="name"
							placeholder="Byron Wade"
							required
						/>
					</StandardFormField>
				)}

				{/* Phone Field (always shown if missing) */}
				{!existingPhone && (
					<StandardFormField
						label="Mobile phone"
						htmlFor="phone"
						description="We'll text urgent dispatch alerts and MFA codes here. Please verify this is a number you can receive texts on."
						required
					>
						<Input
							autoComplete="tel"
							disabled={isLoading}
							id="phone"
							inputMode="tel"
							name="phone"
							pattern="^[0-9+()\\s-]{10,}$"
							placeholder="+1 (831) 555-0199"
							required
							type="tel"
						/>
					</StandardFormField>
				)}

				{/* Profile Image (optional) */}
				<StandardFormField
					label={
						<>
							Profile image{" "}
							{existingAvatar && !hasChangedAvatar && (
								<span className="text-muted-foreground text-xs font-normal">
									(from Google)
								</span>
							)}
						</>
					}
					htmlFor="avatar"
				>
					<div className="border-border/70 flex flex-col gap-4 rounded-2xl border border-dashed p-4 sm:flex-row sm:items-center">
						<div className="border-border/80 relative size-20 shrink-0 overflow-hidden rounded-full border">
							{avatarPreview ? (
								<Image
									alt="Avatar preview"
									className="object-cover"
									fill
									sizes="80px"
									src={avatarPreview}
									unoptimized
								/>
							) : (
								<div className="bg-muted text-muted-foreground flex size-full items-center justify-center">
									<ImageUp className="h-6 w-6" />
								</div>
							)}
						</div>
						<div className="flex w-full flex-col gap-2">
							<Input
								accept={ACCEPTED_IMAGE_TYPES.join(",")}
								aria-describedby="avatar-helper"
								disabled={isLoading}
								id="avatar"
								name="avatar"
								onChange={handleAvatarChange}
								type="file"
							/>
							<p className="text-muted-foreground text-xs" id="avatar-helper">
								{existingAvatar && !hasChangedAvatar
									? "We found your Google profile photo. Upload a different image if you'd like to change it."
									: "JPG, PNG, or WebP — up to 5MB."}
							</p>
							{avatarError && (
								<p className="text-destructive text-xs" role="status">
									{avatarError}
								</p>
							)}
						</div>
					</div>
				</StandardFormField>

				{/* Submit Button */}
				<Button className="w-full" disabled={isLoading} type="submit">
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Completing profile...
						</>
					) : (
						"Continue to Thorbis"
					)}
				</Button>
			</form>
		</div>
	);
}
