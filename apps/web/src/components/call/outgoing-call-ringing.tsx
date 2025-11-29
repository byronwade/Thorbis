"use client";

/**
 * Outgoing Call Ringing Screen
 *
 * Skype-style interface for outbound calls while ringing.
 * Shows customer info if available, loading animation, and call controls.
 */

import {
	PhoneOff,
	PhoneForwarded,
	Video,
	User,
	Building2,
	MapPin,
	Clock,
	DollarSign,
	Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CustomerCallData } from "@/types/call";

interface OutgoingCallRingingProps {
	toNumber: string;
	fromNumber: string;
	customerData: CustomerCallData | null;
	isLoadingCustomer: boolean;
	onCancel: () => void;
	onTransfer: () => void;
	onVideoCall: () => void;
	elapsedTime: number;
}

function formatPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.length === 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
	}
	if (cleaned.length === 11 && cleaned.startsWith("1")) {
		return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
	}
	return phone;
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

export function OutgoingCallRinging({
	toNumber,
	fromNumber,
	customerData,
	isLoadingCustomer,
	onCancel,
	onTransfer,
	onVideoCall,
	elapsedTime,
}: OutgoingCallRingingProps) {
	const [pulseIndex, setPulseIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setPulseIndex((prev) => (prev + 1) % 3);
		}, 400);
		return () => clearInterval(interval);
	}, []);

	const customer = customerData?.customer;
	const hasCustomer = !!customer;

	const displayName = hasCustomer
		? [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
			"Unknown Customer"
		: formatPhone(toNumber);

	const primaryAddress = customerData?.properties?.[0];

	return (
		<div className="bg-background flex h-screen flex-col items-center justify-center">
			{/* Animated background gradient */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="animate-pulse-slow bg-primary/5 absolute -left-1/4 -top-1/4 h-[150%] w-[150%] rounded-full blur-3xl" />
				<div
					className="animate-pulse-slow bg-primary/3 absolute -bottom-1/4 -right-1/4 h-[150%] w-[150%] rounded-full blur-3xl"
					style={{ animationDelay: "1s" }}
				/>
			</div>

			{/* Main content */}
			<div className="relative z-10 flex flex-col items-center px-8">
				{/* Avatar with pulse rings */}
				<div className="relative mb-8">
					{/* Pulse rings */}
					<div className="absolute inset-0 flex items-center justify-center">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className={cn(
									"absolute rounded-full border-2 border-primary/30 transition-all duration-500",
									pulseIndex === i
										? "scale-100 opacity-100"
										: pulseIndex === (i + 1) % 3
											? "scale-150 opacity-50"
											: "scale-200 opacity-0",
								)}
								style={{
									width: 128 + i * 48,
									height: 128 + i * 48,
								}}
							/>
						))}
					</div>

					{/* Avatar */}
					<div
						className={cn(
							"relative flex h-32 w-32 items-center justify-center rounded-full",
							hasCustomer
								? "bg-primary text-primary-foreground"
								: "bg-muted text-muted-foreground",
						)}
					>
						{isLoadingCustomer ? (
							<div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
						) : hasCustomer ? (
							<span className="text-4xl font-semibold">
								{(customer.first_name?.[0] || "").toUpperCase()}
								{(customer.last_name?.[0] || "").toUpperCase()}
							</span>
						) : (
							<User className="h-16 w-16" />
						)}
					</div>
				</div>

				{/* Calling status */}
				<div className="mb-2 flex items-center gap-2">
					<span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
						Calling
					</span>
					<div className="flex gap-1">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className={cn(
									"bg-primary h-1.5 w-1.5 rounded-full transition-opacity duration-300",
									pulseIndex >= i ? "opacity-100" : "opacity-30",
								)}
							/>
						))}
					</div>
				</div>

				{/* Name / Number */}
				<h1 className="mb-1 text-center text-3xl font-semibold">{displayName}</h1>

				{/* Phone number if we have a name */}
				{hasCustomer && (
					<p className="text-muted-foreground mb-4 text-lg">
						{formatPhone(customer.phone || toNumber)}
					</p>
				)}

				{/* Call timer */}
				<div className="text-muted-foreground mb-8 flex items-center gap-2 text-sm">
					<Clock className="h-4 w-4" />
					<span>{formatDuration(elapsedTime)}</span>
				</div>

				{/* Customer info cards (if customer exists) */}
				{hasCustomer && !isLoadingCustomer && (
					<div className="mb-8 grid w-full max-w-md gap-3">
						{/* Company */}
						{customer.company_name && (
							<div className="bg-card/50 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm">
								<Building2 className="text-muted-foreground h-5 w-5 shrink-0" />
								<span className="truncate">{customer.company_name}</span>
							</div>
						)}

						{/* Address */}
						{primaryAddress && (
							<div className="bg-card/50 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm">
								<MapPin className="text-muted-foreground h-5 w-5 shrink-0" />
								<span className="truncate">
									{primaryAddress.street_address}
									{primaryAddress.city && `, ${primaryAddress.city}`}
								</span>
							</div>
						)}

						{/* Stats row */}
						<div className="grid grid-cols-2 gap-3">
							{/* Active Jobs */}
							{customerData?.activeJobs !== undefined &&
								customerData.activeJobs > 0 && (
									<div className="bg-card/50 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm">
										<Briefcase className="text-primary h-5 w-5 shrink-0" />
										<div className="min-w-0">
											<p className="text-muted-foreground truncate text-xs">
												Active Jobs
											</p>
											<p className="font-semibold">{customerData.activeJobs}</p>
										</div>
									</div>
								)}

							{/* Lifetime Value */}
							{customerData?.stats?.lifetime_value !== undefined &&
								customerData.stats.lifetime_value > 0 && (
									<div className="bg-card/50 flex items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-sm">
										<DollarSign className="text-emerald-500 h-5 w-5 shrink-0" />
										<div className="min-w-0">
											<p className="text-muted-foreground truncate text-xs">
												Lifetime Value
											</p>
											<p className="font-semibold">
												{formatCurrency(customerData.stats.lifetime_value)}
											</p>
										</div>
									</div>
								)}
						</div>

						{/* VIP or Notes indicator */}
						{customer.notes && (
							<div className="bg-amber-500/10 flex items-start gap-3 rounded-xl border border-amber-500/20 px-4 py-3">
								<span className="text-amber-500 text-sm">📝</span>
								<p className="text-muted-foreground line-clamp-2 text-sm">
									{customer.notes}
								</p>
							</div>
						)}
					</div>
				)}

				{/* Action buttons */}
				<div className="flex items-center gap-4">
					{/* Video Call */}
					<Button
						variant="outline"
						size="lg"
						className="h-14 w-14 rounded-full"
						onClick={onVideoCall}
						aria-label="Switch to video call"
					>
						<Video className="h-6 w-6" />
					</Button>

					{/* Cancel Call */}
					<Button
						variant="destructive"
						size="lg"
						className="h-16 w-16 rounded-full shadow-lg shadow-destructive/25"
						onClick={onCancel}
						aria-label="Cancel call"
					>
						<PhoneOff className="h-7 w-7" />
					</Button>

					{/* Transfer */}
					<Button
						variant="outline"
						size="lg"
						className="h-14 w-14 rounded-full"
						onClick={onTransfer}
						aria-label="Transfer call"
					>
						<PhoneForwarded className="h-6 w-6" />
					</Button>
				</div>

				{/* Calling from */}
				<p className="text-muted-foreground mt-8 text-sm">
					Calling from {formatPhone(fromNumber)}
				</p>
			</div>
		</div>
	);
}
