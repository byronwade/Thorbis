/**
 * Billing Info Block - Custom Tiptap Node
 *
 * Displays and edits customer billing information:
 * - Payment terms
 * - Credit limit
 * - Tax exempt status
 * - Billing email
 */

"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { CreditCard, Mail, Plus, Shield } from "lucide-react";
import { useState } from "react";
import {
	removeCustomerPaymentMethod,
	setDefaultCustomerPaymentMethod,
} from "@/actions/customer-payment-methods";
import { Checkbox } from "@/components/ui/checkbox";
import {
	CollapsibleActionButton,
	CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AddPaymentMethodDialog } from "../add-payment-method-dialog";
import { PaymentMethodCard } from "../payment-method-card";

// React component that renders the block
export function BillingInfoBlockComponent({
	node,
	updateAttributes,
	editor,
}: any) {
	const {
		billingEmail,
		paymentTerms,
		creditLimit,
		taxExempt,
		taxExemptNumber,
		paymentMethods,
		customerId,
	} = node.attrs;
	const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const handleSetDefault = async (paymentMethodId: string) => {
		setIsUpdating(true);
		const result = await setDefaultCustomerPaymentMethod(
			paymentMethodId,
			customerId,
		);
		setIsUpdating(false);

		if (result.success) {
			// Update local state - set all to non-default, then set selected as default
			const updatedMethods = paymentMethods.map((pm: any) => ({
				...pm,
				is_default: pm.id === paymentMethodId,
			}));
			updateAttributes({ paymentMethods: updatedMethods });
		} else {
			alert(result.error || "Failed to set default payment method");
		}
	};

	const handleRemove = async (paymentMethodId: string) => {
		if (!confirm("Are you sure you want to remove this payment method?")) {
			return;
		}

		setIsUpdating(true);
		const result = await removeCustomerPaymentMethod(
			paymentMethodId,
			customerId,
		);
		setIsUpdating(false);

		if (result.success) {
			// Update local state - remove the payment method
			const updatedMethods = paymentMethods.filter(
				(pm: any) => pm.id !== paymentMethodId,
			);
			updateAttributes({ paymentMethods: updatedMethods });
		} else {
			alert(result.error || "Failed to remove payment method");
		}
	};

	const _getCardIcon = (brand: string) => {
		switch (brand.toLowerCase()) {
			case "visa":
				return "💳";
			case "mastercard":
				return "💳";
			case "amex":
				return "💳";
			case "discover":
				return "💳";
			default:
				return "💳";
		}
	};

	const _formatCurrency = (cents: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(cents / 100);

	const _paymentTermsLabels: Record<string, string> = {
		due_on_receipt: "Due on Receipt",
		net_15: "Net 15",
		net_30: "Net 30",
		net_60: "Net 60",
		net_90: "Net 90",
	};

	const handleAddPaymentMethod = () => {
		setShowAddPaymentDialog(true);
	};

	return (
		<NodeViewWrapper className="billing-info-block">
			<AddPaymentMethodDialog
				customerId={customerId}
				onOpenChange={setShowAddPaymentDialog}
				onSuccess={() => {
					// Reload payment methods
					setShowAddPaymentDialog(false);
				}}
				open={showAddPaymentDialog}
			/>
			<CollapsibleDataSection
				actions={
					<CollapsibleActionButton
						icon={<Plus className="size-4" />}
						onClick={handleAddPaymentMethod}
					>
						Add Payment Method
					</CollapsibleActionButton>
				}
				defaultOpen={false}
				icon={<CreditCard className="size-5" />}
				standalone={true}
				storageKey="customer-billing-section"
				title="Billing Information"
				value="customer-billing"
			>
				<div className="grid gap-6 md:grid-cols-2">
					{/* Billing Email */}
					<div className="space-y-2">
						<Label
							className="flex items-center gap-1"
							htmlFor={`billingEmail-${node.attrs.id}`}
						>
							<Mail className="size-3" />
							Billing Email
						</Label>
						<Input
							id={`billingEmail-${node.attrs.id}`}
							onChange={(e) =>
								updateAttributes({ billingEmail: e.target.value })
							}
							placeholder="billing@example.com"
							type="email"
							value={billingEmail || ""}
						/>
					</div>

					{/* Payment Terms */}
					<div className="space-y-2">
						<Label htmlFor={`paymentTerms-${node.attrs.id}`}>
							Payment Terms
						</Label>
						<Select
							onValueChange={(value) =>
								updateAttributes({ paymentTerms: value })
							}
							value={paymentTerms || "due_on_receipt"}
						>
							<SelectTrigger id={`paymentTerms-${node.attrs.id}`}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
								<SelectItem value="net_15">Net 15</SelectItem>
								<SelectItem value="net_30">Net 30</SelectItem>
								<SelectItem value="net_60">Net 60</SelectItem>
								<SelectItem value="net_90">Net 90</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Credit Limit */}
					<div className="space-y-2">
						<Label htmlFor={`creditLimit-${node.attrs.id}`}>Credit Limit</Label>
						<Input
							id={`creditLimit-${node.attrs.id}`}
							onChange={(e) =>
								updateAttributes({
									creditLimit: Number.parseFloat(e.target.value) * 100,
								})
							}
							placeholder="0.00"
							step="0.01"
							type="number"
							value={creditLimit ? creditLimit / 100 : ""}
						/>
					</div>

					{/* Tax Exempt */}
					<div className="space-y-2">
						<Label
							className="flex items-center gap-1"
							htmlFor={`taxExempt-${node.attrs.id}`}
						>
							<Shield className="size-3" />
							Tax Status
						</Label>
						<div className="flex items-center space-x-2">
							<Checkbox
								checked={taxExempt}
								id={`taxExempt-${node.attrs.id}`}
								onCheckedChange={(checked) =>
									updateAttributes({ taxExempt: checked })
								}
							/>
							<label
								className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								htmlFor={`taxExempt-${node.attrs.id}`}
							>
								Tax Exempt
							</label>
						</div>
					</div>

					{/* Tax Exempt Number (only if tax exempt) */}
					{taxExempt && (
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor={`taxExemptNumber-${node.attrs.id}`}>
								Tax Exempt Number
							</Label>
							<Input
								id={`taxExemptNumber-${node.attrs.id}`}
								onChange={(e) =>
									updateAttributes({ taxExemptNumber: e.target.value })
								}
								placeholder="Enter tax exempt number"
								value={taxExemptNumber || ""}
							/>
						</div>
					)}

					{/* Saved Payment Methods */}
					<div className="mt-6 space-y-3 border-t pt-6 md:col-span-2">
						<h4 className="text-sm font-semibold">
							Saved Payment Methods ({paymentMethods?.length || 0})
						</h4>
						{paymentMethods && paymentMethods.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{paymentMethods.map((pm: any) => {
									// Determine payment method type
									const type =
										pm.type === "ach" || pm.type === "bank" ? pm.type : "card";

									return (
										<PaymentMethodCard
											account_type={pm.account_type}
											bank_name={pm.bank_name}
											card_brand={pm.card_brand || pm.brand}
											card_exp_month={pm.card_exp_month || pm.exp_month}
											card_exp_year={pm.card_exp_year || pm.exp_year}
											card_last4={pm.card_last4 || pm.last4}
											cardholder_name={pm.cardholder_name || pm.name}
											disabled={isUpdating}
											id={pm.id}
											is_default={pm.is_default}
											is_verified={pm.is_verified}
											key={pm.id}
											nickname={pm.nickname}
											onRemove={() => handleRemove(pm.id)}
											onSetDefault={() => handleSetDefault(pm.id)}
											type={type}
										/>
									);
								})}
							</div>
						) : (
							<div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
								<CreditCard className="text-muted-foreground/50 mx-auto mb-2 size-8" />
								<p className="text-muted-foreground text-sm">
									No payment methods on file
								</p>
								<p className="text-muted-foreground mt-1 text-xs">
									Add a card or bank account to streamline payments
								</p>
							</div>
						)}
					</div>
				</div>
			</CollapsibleDataSection>
		</NodeViewWrapper>
	);
}

// Tiptap Node Extension
export const BillingInfoBlock = Node.create({
	name: "billingInfoBlock",

	group: "block",

	atom: true,

	draggable: true,

	addAttributes() {
		return {
			id: {
				default: null,
			},
			billingEmail: {
				default: "",
			},
			paymentTerms: {
				default: "due_on_receipt",
			},
			creditLimit: {
				default: 0,
			},
			taxExempt: {
				default: false,
			},
			taxExemptNumber: {
				default: "",
			},
			paymentMethods: {
				default: [],
			},
			customerId: {
				default: null,
			},
		} as any;
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="billing-info-block"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"div",
			mergeAttributes(HTMLAttributes, { "data-type": "billing-info-block" }),
			0,
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(BillingInfoBlockComponent);
	},

	addCommands() {
		return {
			insertBillingInfoBlock:
				(attributes: any) =>
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
