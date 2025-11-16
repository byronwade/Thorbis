"use client";

/**
 * SmartContactInput Component
 *
 * AI-powered contact input that intelligently parses pasted data
 * - Detects and auto-fills email addresses
 * - Detects and auto-fills phone numbers
 * - Parses full names into first/last
 * - Supports paste-and-fill workflow
 * - Real-time validation with visual feedback
 */

import { Check, Mail, Phone, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
};

type SmartContactInputProps = {
	onContactChange: (contact: ContactData) => void;
	initialContact?: ContactData;
	showAiHelper?: boolean;
};

export function SmartContactInput({
	onContactChange,
	initialContact,
	showAiHelper = true,
}: SmartContactInputProps) {
	const [contact, setContact] = useState<ContactData>(
		initialContact || {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
		},
	);
	const [pasteText, setPasteText] = useState("");
	const [showPasteHelper, setShowPasteHelper] = useState(false);
	const [validationState, setValidationState] = useState({
		email: false,
		phone: false,
	});

	// Extract email from text
	const extractEmail = (text: string): string | null => {
		const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
		const match = text.match(emailRegex);
		return match ? match[0] : null;
	};

	// Extract phone from text
	const extractPhone = (text: string): string | null => {
		// Remove common formatting
		const cleaned = text.replace(/[^\d]/g, "");

		// Match 10-11 digit phone numbers
		if (cleaned.length === 10) {
			return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
		}
		if (cleaned.length === 11 && cleaned[0] === "1") {
			return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
		}

		// Try to find phone pattern
		const phoneRegex = /(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})/;
		const match = text.match(phoneRegex);
		return match ? `(${match[1]}) ${match[2]}-${match[3]}` : null;
	};

	// Extract name from text
	const extractName = (
		text: string,
	): { first: string; last: string } | null => {
		// Remove email and phone
		let cleaned = text.replace(
			/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
			"",
		);
		cleaned = cleaned.replace(/[\d()\-\s.]+/g, " ");
		cleaned = cleaned.trim();

		const parts = cleaned.split(/\s+/).filter(Boolean);
		if (parts.length >= 2) {
			return {
				first: parts[0],
				last: parts.slice(1).join(" "),
			};
		}
		if (parts.length === 1) {
			return { first: parts[0], last: "" };
		}
		return null;
	};

	// Handle smart paste
	const handleSmartPaste = (text: string) => {
		const email = extractEmail(text);
		const phone = extractPhone(text);
		const name = extractName(text);

		const updated = { ...contact };

		if (email) {
			updated.email = email;
		}
		if (phone) {
			updated.phone = phone;
		}
		if (name) {
			updated.firstName = name.first;
			updated.lastName = name.last;
		}

		setContact(updated);
		onContactChange(updated);
		setPasteText("");
		setShowPasteHelper(false);

		// Update validation
		setValidationState({
			email: !!email,
			phone: !!phone,
		});
	};

	const handleFieldChange = (field: keyof ContactData, value: string) => {
		const updated = { ...contact, [field]: value };
		setContact(updated);
		onContactChange(updated);

		// Validate email/phone
		if (field === "email") {
			setValidationState((prev) => ({
				...prev,
				email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
			}));
		}
		if (field === "phone") {
			setValidationState((prev) => ({
				...prev,
				phone: value.replace(/\D/g, "").length >= 10,
			}));
		}
	};

	return (
		<div className="space-y-6">
			{/* AI Paste Helper */}
			{showAiHelper && (
				<div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
					<div className="mb-3 flex items-center gap-2">
						<Sparkles className="size-4 text-primary" />
						<h3 className="font-medium text-sm">Smart Fill</h3>
					</div>

					{showPasteHelper ? (
						<div className="space-y-3">
							<Textarea
								className="min-h-[100px] font-mono text-sm"
								onChange={(e) => setPasteText(e.target.value)}
								placeholder={
									"Paste contact info here, like:\n\nJohn Smith\njohn@example.com\n(555) 123-4567"
								}
								value={pasteText}
							/>
							<div className="flex gap-2">
								<button
									className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
									onClick={() => handleSmartPaste(pasteText)}
									type="button"
								>
									<Sparkles className="mr-2 inline size-4" />
									Auto-Fill Fields
								</button>
								<button
									className="text-muted-foreground text-sm"
									onClick={() => {
										setShowPasteHelper(false);
										setPasteText("");
									}}
									type="button"
								>
									Cancel
								</button>
							</div>
						</div>
					) : (
						<div>
							<p className="mb-3 text-muted-foreground text-sm">
								Paste contact info from anywhere (email signature, business
								card, text message) and we'll auto-fill the fields.
							</p>
							<button
								className="text-primary text-sm underline"
								onClick={() => setShowPasteHelper(true)}
								type="button"
							>
								Try it now →
							</button>
						</div>
					)}
				</div>
			)}

			{/* Name Fields */}
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="firstName">
						First Name <span className="text-destructive">*</span>
					</Label>
					<div className="relative">
						<User className="absolute top-3 left-3 size-4 text-muted-foreground" />
						<Input
							className="pl-10"
							id="firstName"
							onChange={(e) => handleFieldChange("firstName", e.target.value)}
							placeholder="John"
							required
							value={contact.firstName}
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="lastName">
						Last Name <span className="text-destructive">*</span>
					</Label>
					<div className="relative">
						<User className="absolute top-3 left-3 size-4 text-muted-foreground" />
						<Input
							className="pl-10"
							id="lastName"
							onChange={(e) => handleFieldChange("lastName", e.target.value)}
							placeholder="Smith"
							required
							value={contact.lastName}
						/>
					</div>
				</div>
			</div>

			{/* Email Field */}
			<div className="space-y-2">
				<Label htmlFor="email">
					Email <span className="text-destructive">*</span>
				</Label>
				<div className="relative">
					<Mail className="absolute top-3 left-3 size-4 text-muted-foreground" />
					<Input
						className="pr-10 pl-10"
						id="email"
						onChange={(e) => handleFieldChange("email", e.target.value)}
						placeholder="john@example.com"
						required
						type="email"
						value={contact.email}
					/>
					{contact.email && validationState.email && (
						<Check className="absolute top-3 right-3 size-4 text-success" />
					)}
				</div>
			</div>

			{/* Phone Field */}
			<div className="space-y-2">
				<Label htmlFor="phone">
					Phone <span className="text-destructive">*</span>
				</Label>
				<div className="relative">
					<Phone className="absolute top-3 left-3 size-4 text-muted-foreground" />
					<Input
						className="pr-10 pl-10"
						id="phone"
						onChange={(e) => handleFieldChange("phone", e.target.value)}
						placeholder="(555) 123-4567"
						required
						type="tel"
						value={contact.phone}
					/>
					{contact.phone && validationState.phone && (
						<Check className="absolute top-3 right-3 size-4 text-success" />
					)}
				</div>
			</div>
		</div>
	);
}
