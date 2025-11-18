"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signContract } from "@/actions/contracts";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignaturePad } from "@/components/work/signature-pad";

/**
 * Contract Signing Form - Client Component
 *
 * Public-facing form for customers to sign contracts.
 * Captures signature, signer information, and tracks IP address.
 */

type ContractSigningFormProps = {
	contractId: string;
	defaultEmail?: string;
};

export function ContractSigningForm({
	contractId,
	defaultEmail,
}: ContractSigningFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [signature, setSignature] = useState<string | null>(null);
	const [agreed, setAgreed] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!signature) {
			setError("Please provide your signature");
			return;
		}

		if (!agreed) {
			setError("Please agree to the terms and conditions");
			return;
		}

		setIsLoading(true);
		setError(null);

		const formData = new FormData(event.currentTarget);
		formData.append("contractId", contractId);
		formData.append("signature", signature);

		// Get client IP (in production, this should be done server-side)
		// For now, we'll pass it as empty and let the server action handle it
		formData.append("ipAddress", "");

		const result = await signContract(formData);

		if (result.success) {
			// Redirect to success page or show success message
			router.push(`/contracts/sign/${contractId}/success`);
		} else {
			setError(result.error || "Failed to sign contract");
			setIsLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className="space-y-6">
				{/* Signer Information */}
				<Card>
					<CardHeader>
						<CardTitle>Your Information</CardTitle>
						<CardDescription>
							Please provide your details to complete the signature
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="signerName">Full Name *</Label>
								<Input
									id="signerName"
									name="signerName"
									placeholder="John Doe"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="signerEmail">Email Address *</Label>
								<Input
									defaultValue={defaultEmail}
									id="signerEmail"
									name="signerEmail"
									placeholder="john@example.com"
									required
									type="email"
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="signerTitle">Job Title (Optional)</Label>
								<Input
									id="signerTitle"
									name="signerTitle"
									placeholder="e.g., CEO, Manager"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="signerCompany">Company (Optional)</Label>
								<Input
									id="signerCompany"
									name="signerCompany"
									placeholder="Company name"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Signature Pad */}
				<SignaturePad disabled={isLoading} onSignatureChange={setSignature} />

				{/* Agreement Checkbox */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-start gap-3">
							<Checkbox
								checked={agreed}
								disabled={isLoading}
								id="agree"
								onCheckedChange={(checked) => setAgreed(checked === true)}
							/>
							<div className="space-y-1">
								<Label
									className="cursor-pointer leading-relaxed font-normal"
									htmlFor="agree"
								>
									I have read and agree to the terms and conditions outlined in
									this contract. I understand that my electronic signature is
									legally binding and has the same effect as a handwritten
									signature.
								</Label>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Error Message */}
				{error && (
					<div className="border-destructive bg-destructive/10 rounded-lg border p-4">
						<p className="text-destructive text-sm font-medium">{error}</p>
					</div>
				)}

				{/* Submit Button */}
				<Button
					className="w-full"
					disabled={isLoading || !signature || !agreed}
					size="lg"
					type="submit"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 size-5 animate-spin" />
							Signing Contract...
						</>
					) : (
						<>
							<Check className="mr-2 size-5" />
							Sign Contract
						</>
					)}
				</Button>

				<p className="text-muted-foreground text-center text-xs">
					Your signature will be recorded along with the date, time, and your IP
					address for legal compliance.
				</p>
			</div>
		</form>
	);
}
