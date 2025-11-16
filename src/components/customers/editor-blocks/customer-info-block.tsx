/**
 * Customer Info Block - Custom Tiptap Node
 *
 * Displays customer basic information as an editable block:
 * - Name (first_name, last_name)
 * - Email
 * - Phone
 * - Company name
 * - Customer type badge
 *
 * This is a Tiptap Node Extension that renders as a React component
 * All fields are always editable (no view/edit mode toggle)
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { Building2, Mail, Phone, User } from "lucide-react";
import { CollapsibleDataSection } from "@/components/ui/collapsible-data-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// React component that renders the block
export function CustomerInfoBlockComponent({ node, updateAttributes, editor }: any) {
	const { displayName, firstName, lastName, email, phone, secondaryPhone, billingEmail, companyName, customerType } =
		node.attrs;

	return (
		<NodeViewWrapper className="customer-info-block">
			<CollapsibleDataSection
				defaultOpen={true}
				icon={<User className="size-5" />}
				standalone={true}
				storageKey="customer-info-section"
				title="Customer Information"
				value="customer-info"
			>
				<div className="space-y-6">
					{/* Profile Display Name - Full Width at Top */}
					<div className="space-y-2">
						<Label className="flex items-center gap-1" htmlFor={`displayName-${node.attrs.id}`}>
							<User className="size-3" />
							Profile Display Name
						</Label>
						<Input
							className="font-medium text-lg"
							id={`displayName-${node.attrs.id}`}
							onChange={(e) => updateAttributes({ displayName: e.target.value })}
							placeholder="e.g., Mr. Wade, Ms. Johnson, The Smiths"
							value={displayName || ""}
						/>
						<p className="text-muted-foreground text-xs">
							How you'd like to address this customer (nicknames, titles, etc.)
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* First Name */}
						<div className="space-y-2">
							<Label htmlFor={`firstName-${node.attrs.id}`}>First Name *</Label>
							<Input
								id={`firstName-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ firstName: e.target.value })}
								placeholder="John"
								value={firstName || ""}
							/>
						</div>

						{/* Last Name */}
						<div className="space-y-2">
							<Label htmlFor={`lastName-${node.attrs.id}`}>Last Name *</Label>
							<Input
								id={`lastName-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ lastName: e.target.value })}
								placeholder="Smith"
								value={lastName || ""}
							/>
						</div>

						{/* Email */}
						<div className="space-y-2">
							<Label className="flex items-center gap-1" htmlFor={`email-${node.attrs.id}`}>
								<Mail className="size-3" />
								Email *
							</Label>
							<Input
								id={`email-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ email: e.target.value })}
								placeholder="john@example.com"
								type="email"
								value={email || ""}
							/>
						</div>

						{/* Phone */}
						<div className="space-y-2">
							<Label className="flex items-center gap-1" htmlFor={`phone-${node.attrs.id}`}>
								<Phone className="size-3" />
								Phone *
							</Label>
							<Input
								id={`phone-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ phone: e.target.value })}
								placeholder="(555) 123-4567"
								type="tel"
								value={phone || ""}
							/>
						</div>

						{/* Secondary Phone */}
						<div className="space-y-2">
							<Label className="flex items-center gap-1" htmlFor={`secondaryPhone-${node.attrs.id}`}>
								<Phone className="size-3" />
								Secondary Phone
							</Label>
							<Input
								id={`secondaryPhone-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ secondaryPhone: e.target.value })}
								placeholder="(555) 987-6543"
								type="tel"
								value={secondaryPhone || ""}
							/>
						</div>

						{/* Billing Email */}
						<div className="space-y-2">
							<Label className="flex items-center gap-1" htmlFor={`billingEmail-${node.attrs.id}`}>
								<Mail className="size-3" />
								Billing Email
							</Label>
							<Input
								id={`billingEmail-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ billingEmail: e.target.value })}
								placeholder="billing@example.com"
								type="email"
								value={billingEmail || ""}
							/>
						</div>

						{/* Company Name */}
						<div className="space-y-2">
							<Label className="flex items-center gap-1" htmlFor={`companyName-${node.attrs.id}`}>
								<Building2 className="size-3" />
								Company Name
							</Label>
							<Input
								id={`companyName-${node.attrs.id}`}
								onChange={(e) => updateAttributes({ companyName: e.target.value })}
								placeholder="Acme Corporation"
								value={companyName || ""}
							/>
						</div>

						{/* Customer Type */}
						<div className="space-y-2">
							<Label htmlFor={`customerType-${node.attrs.id}`}>Customer Type *</Label>
							<Select
								onValueChange={(value) => updateAttributes({ customerType: value })}
								value={customerType || "residential"}
							>
								<SelectTrigger id={`customerType-${node.attrs.id}`}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="residential">Residential</SelectItem>
									<SelectItem value="commercial">Commercial</SelectItem>
									<SelectItem value="industrial">Industrial</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</CollapsibleDataSection>
		</NodeViewWrapper>
	);
}

// Tiptap Node Extension
export const CustomerInfoBlock = Node.create({
	name: "customerInfoBlock",

	group: "block",

	atom: true,

	draggable: true,

	addAttributes() {
		return {
			id: {
				default: null,
			},
			displayName: {
				default: "",
			},
			firstName: {
				default: "",
			},
			lastName: {
				default: "",
			},
			email: {
				default: "",
			},
			phone: {
				default: "",
			},
			secondaryPhone: {
				default: "",
			},
			billingEmail: {
				default: "",
			},
			companyName: {
				default: "",
			},
			customerType: {
				default: "residential",
			},
		} as any;
	},

	parseHTML() {
		return [
			{
				tag: 'div[data-type="customer-info-block"]',
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["div", mergeAttributes(HTMLAttributes, { "data-type": "customer-info-block" }), 0];
	},

	addNodeView() {
		return ReactNodeViewRenderer(CustomerInfoBlockComponent);
	},

	addCommands() {
		return {
			insertCustomerInfoBlock:
				(attributes: any) =>
				({ commands }: any) =>
					commands.insertContent({
						type: this.name,
						attrs: attributes,
					}),
		} as any;
	},
});
