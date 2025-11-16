"use client";

/**
 * Customer Page Editor - Novel-Based Inline Editing
 *
 * Notion-style editor for customer pages with:
 * - Inline editing of all content and layout
 * - Custom blocks for customer data (info, metrics, tables)
 * - Slash commands for quick block insertion
 * - Drag-and-drop block reordering
 * - Auto-save functionality
 * - Team mentions, images, tables, link previews
 *
 * Performance:
 * - Client Component (requires interactivity)
 * - Lazy loaded on edit mode only
 * - Debounced auto-save (2 second delay)
 * - Optimistic UI updates
 */

import { Image as TiptapImage } from "@tiptap/extension-image";
import { Mention as TiptapMention } from "@tiptap/extension-mention";
import { Placeholder as TiptapPlaceholder } from "@tiptap/extension-placeholder";
import { Table as TiptapTable } from "@tiptap/extension-table";
import { TableCell as TiptapTableCell } from "@tiptap/extension-table-cell";
import { TableHeader as TiptapTableHeader } from "@tiptap/extension-table-header";
import { TableRow as TiptapTableRow } from "@tiptap/extension-table-row";
import StarterKit from "@tiptap/starter-kit";
import {
	AtSign,
	Bold,
	Briefcase,
	ChevronDown,
	Clock,
	DollarSign,
	FileText,
	Image as ImageIcon,
	Italic,
	LayoutGrid,
	Link as LinkIcon,
	List,
	ListOrdered,
	Plus,
	Table as TableIcon,
	Users,
	Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	LazyTipTapEditor as EditorContent,
	useEditor,
} from "@/components/lazy/tiptap-editor";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ActivityTimelineBlock } from "./editor-blocks/activity-timeline-block";
import { AddressPropertiesAdaptiveBlock } from "./editor-blocks/address-properties-adaptive-block";
import { BillingInfoBlock } from "./editor-blocks/billing-info-block";
import { CustomerBadgesBlock } from "./editor-blocks/customer-badges-block";
import { CustomerContactsBlock } from "./editor-blocks/customer-contacts-block";
import { CustomerInfoBlock } from "./editor-blocks/customer-info-block";
import { DocumentsMediaBlock } from "./editor-blocks/documents-media-block";
import { EquipmentTableBlock } from "./editor-blocks/equipment-table-block";
import { InvoicesTableBlock } from "./editor-blocks/invoices-table-block";
import { JobsTableBlock } from "./editor-blocks/jobs-table-block";
import { MetricsBlock } from "./editor-blocks/metrics-block";
import { NotesCollapsibleBlock } from "./editor-blocks/notes-collapsible-block";

type CustomerPageEditorProps = {
	customerId: string;
	initialContent?: any; // Tiptap JSON
	initialData?: any; // Customer data for custom blocks
	isEditable?: boolean;
	onChange?: (content: any) => void;
	className?: string;
};

export function CustomerPageEditor({
	customerId,
	initialContent,
	initialData,
	isEditable = false,
	onChange,
	className,
}: CustomerPageEditorProps) {
	// Generate default content - simplified for testing
	const getDefaultContent = () => {
		// Check if we have valid existing content (not just empty doc)
		if (
			initialContent &&
			initialContent.type === "doc" &&
			initialContent.content &&
			initialContent.content.length > 0
		) {
			// Update content blocks with fresh data from database
			const updatedContent = initialContent.content.map((node: any) => {
				const nodeAttrs = node.attrs || {};

				// Merge fresh customer data into customerInfoBlock
				if (node.type === "customerInfoBlock") {
					return {
						...node,
						attrs: {
							id: initialData?.id,
							displayName:
								initialData?.display_name || nodeAttrs.displayName || "",
							firstName: initialData?.first_name || nodeAttrs.firstName || "",
							lastName: initialData?.last_name || nodeAttrs.lastName || "",
							email: initialData?.email || nodeAttrs.email || "",
							phone: initialData?.phone || nodeAttrs.phone || "",
							secondaryPhone:
								initialData?.secondary_phone || nodeAttrs.secondaryPhone || "",
							billingEmail:
								initialData?.billing_email || nodeAttrs.billingEmail || "",
							companyName:
								initialData?.company_name || nodeAttrs.companyName || "",
							customerType:
								initialData?.type || nodeAttrs.customerType || "residential",
						},
					};
				}

				// Update other blocks with fresh data
				if (node.type === "jobsTableBlock") {
					return {
						...node,
						attrs: { jobs: initialData?.jobs || [], customerId },
					};
				}
				if (node.type === "invoicesTableBlock") {
					return {
						...node,
						attrs: { invoices: initialData?.invoices || [], customerId },
					};
				}
				if (node.type === "equipmentTableBlock") {
					return {
						...node,
						attrs: { equipment: initialData?.equipment || [], customerId },
					};
				}
				if (node.type === "documentsMediaBlock") {
					return {
						...node,
						attrs: {
							attachments: initialData?.attachments || [],
							properties: initialData?.properties || [],
							jobs: initialData?.jobs || [],
							customerId,
						},
					};
				}
				if (node.type === "addressPropertiesAdaptiveBlock") {
					return {
						...node,
						attrs: {
							id: initialData?.id,
							address: initialData?.address || nodeAttrs.address || "",
							address2: initialData?.address2 || nodeAttrs.address2 || "",
							city: initialData?.city || nodeAttrs.city || "",
							state: initialData?.state || nodeAttrs.state || "",
							zipCode: initialData?.zip_code || nodeAttrs.zipCode || "",
							country: initialData?.country || nodeAttrs.country || "USA",
							properties: initialData?.properties || [],
							customerId,
						},
					};
				}
				if (node.type === "billingInfoBlock") {
					return {
						...node,
						attrs: {
							id: initialData?.id,
							billingEmail:
								initialData?.billing_email || nodeAttrs.billingEmail || "",
							paymentTerms:
								initialData?.payment_terms ||
								nodeAttrs.paymentTerms ||
								"due_on_receipt",
							creditLimit:
								initialData?.credit_limit || nodeAttrs.creditLimit || 0,
							taxExempt: initialData?.tax_exempt || nodeAttrs.taxExempt,
							taxExemptNumber:
								initialData?.tax_exempt_number ||
								nodeAttrs.taxExemptNumber ||
								"",
							paymentMethods: initialData?.paymentMethods || [],
							customerId,
						},
					};
				}
				if (node.type === "notesCollapsibleBlock") {
					return {
						...node,
						attrs: {
							customerId,
							notesCount: 0,
						},
					};
				}
				if (node.type === "customerContactsBlock") {
					return {
						...node,
						attrs: {
							customerId,
							contactsCount: 0,
						},
					};
				}

				return node;
			});

			// Check if badges block exists, if not, add it at the beginning
			const hasBadgesBlock = updatedContent.some(
				(node: any) => node.type === "customerBadgesBlock",
			);

			if (!hasBadgesBlock) {
				return {
					...initialContent,
					content: [
						{
							type: "customerBadgesBlock",
							attrs: {
								customerId,
							},
						},
						...updatedContent,
					],
				};
			}

			return {
				...initialContent,
				content: updatedContent,
			};
		}
		return {
			type: "doc",
			content: [
				{
					type: "customerBadgesBlock",
					attrs: {
						customerId,
					},
				},
				{
					type: "customerInfoBlock",
					attrs: {
						id: initialData?.id,
						displayName: initialData?.display_name || "",
						firstName: initialData?.first_name || "",
						lastName: initialData?.last_name || "",
						email: initialData?.email || "",
						phone: initialData?.phone || "",
						secondaryPhone: initialData?.secondary_phone || "",
						billingEmail: initialData?.billing_email || "",
						companyName: initialData?.company_name || "",
						customerType: initialData?.type || "residential",
					},
				},
				{
					type: "customerContactsBlock",
					attrs: {
						customerId,
						contactsCount: 0, // Will be loaded dynamically
					},
				},
				{
					type: "addressPropertiesAdaptiveBlock",
					attrs: {
						id: initialData?.id,
						// Primary address from customer record
						address: initialData?.address || "",
						address2: initialData?.address2 || "",
						city: initialData?.city || "",
						state: initialData?.state || "",
						zipCode: initialData?.zip_code || "",
						country: initialData?.country || "USA",
						// All properties including primary
						properties: initialData?.properties || [],
						customerId,
					},
				},
				{
					type: "jobsTableBlock",
					attrs: {
						jobs: initialData?.jobs || [],
						customerId,
					},
				},
				{
					type: "invoicesTableBlock",
					attrs: {
						invoices: initialData?.invoices || [],
						customerId,
					},
				},
				{
					type: "equipmentTableBlock",
					attrs: {
						equipment: initialData?.equipment || [],
						customerId,
					},
				},
				{
					type: "documentsMediaBlock",
					attrs: {
						attachments: initialData?.attachments || [],
						properties: initialData?.properties || [],
						jobs: initialData?.jobs || [],
						customerId,
					},
				},
				{
					type: "billingInfoBlock",
					attrs: {
						id: initialData?.id,
						billingEmail: initialData?.billing_email || "",
						paymentTerms: initialData?.payment_terms || "due_on_receipt",
						creditLimit: initialData?.credit_limit || 0,
						taxExempt: initialData?.tax_exempt,
						taxExemptNumber: initialData?.tax_exempt_number || "",
						paymentMethods: initialData?.paymentMethods || [],
						customerId,
					},
				},
				{
					type: "notesCollapsibleBlock",
					attrs: {
						customerId,
						notesCount: 0, // Will be loaded dynamically
					},
				},
				{
					type: "activityTimelineBlock",
					attrs: {
						activities: initialData?.activities || [],
					},
				},
			],
		};
	};

	// State for URL input dialogs
	const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
	const [linkUrl, setLinkUrl] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	// Initialize editor with all extensions
	const editor = useEditor({
		immediatelyRender: false, // Required for Next.js SSR to avoid hydration mismatches
		extensions: [
			StarterKit, // Already includes Link, so don't add it again
			TiptapImage.configure({
				HTMLAttributes: {
					class: "rounded-lg max-w-full h-auto",
				},
			}),
			TiptapTable.configure({
				resizable: true,
				HTMLAttributes: {
					class: "border-collapse table-auto w-full",
				},
			}),
			TiptapTableRow,
			TiptapTableHeader.configure({
				HTMLAttributes: {
					class:
						"border border-border bg-muted/50 px-4 py-2 text-left font-medium",
				},
			}),
			TiptapTableCell.configure({
				HTMLAttributes: {
					class: "border border-border px-4 py-2",
				},
			}),
			TiptapPlaceholder.configure({
				placeholder: ({ node }) => {
					if (node.type.name === "heading") {
						return "Untitled";
					}
					return 'Type "/" for commands, or start typing...';
				},
			}),
			TiptapMention.configure({
				HTMLAttributes: {
					class: "mention rounded bg-primary/10 px-1 py-0.5 text-primary",
				},
				suggestion: {
					// TODO: Implement team member suggestions
					items: async ({ query }) => {
						// This would fetch team members from the database
						return [
							{ id: "1", label: "Team Member 1" },
							{ id: "2", label: "Team Member 2" },
						].filter((item) =>
							item.label.toLowerCase().includes(query.toLowerCase()),
						);
					},
					render: () => {
						// TODO: Implement custom mention dropdown UI
						return {
							onStart: () => {},
							onUpdate: () => {},
							onExit: () => {},
							onKeyDown: () => false,
						};
					},
				},
			}),
			// Custom blocks for customer data
			CustomerBadgesBlock,
			CustomerInfoBlock,
			CustomerContactsBlock,
			MetricsBlock,
			JobsTableBlock,
			AddressPropertiesAdaptiveBlock,
			InvoicesTableBlock,
			EquipmentTableBlock,
			DocumentsMediaBlock,
			BillingInfoBlock,
			NotesCollapsibleBlock,
			ActivityTimelineBlock,
		],
		content: getDefaultContent(),
		editable: isEditable,
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-sm mx-auto min-h-screen w-full max-w-7xl px-4 py-4 pb-96 focus:outline-none",
					isEditable && "cursor-text",
				),
			},
			// Enable drag and drop
			handleDOMEvents: {
				dragstart: () => false,
				drop: () => false,
			},
		},
		onUpdate: ({ editor }) => {
			if (onChange) {
				onChange(editor.getJSON());
			}
		},
	});

	// Debug logging
	useEffect(() => {}, []);

	if (!editor) {
		return (
			<div className="flex h-[500px] items-center justify-center border-2 border-muted-foreground/50 border-dashed bg-muted/30">
				<div className="text-center">
					<p className="text-muted-foreground">Loading editor...</p>
					<p className="mt-2 text-muted-foreground text-xs">
						If this persists, check browser console for errors
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("relative w-full", className)}>
			{/* Floating Toolbar - Always visible since page is always editable */}
			<div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				{/* Editor Controls */}
				<div className="flex items-center gap-1">
					<Button
						className={cn(editor.isActive("bold") && "bg-muted")}
						onClick={() => editor.chain().focus().toggleBold().run()}
						size="sm"
						title="Bold (Cmd+B)"
						type="button"
						variant="ghost"
					>
						<Bold className="size-4" />
					</Button>
					<Button
						className={cn(editor.isActive("italic") && "bg-muted")}
						onClick={() => editor.chain().focus().toggleItalic().run()}
						size="sm"
						title="Italic (Cmd+I)"
						type="button"
						variant="ghost"
					>
						<Italic className="size-4" />
					</Button>
					<Separator className="mx-1 h-6" orientation="vertical" />
					<Button
						className={cn(editor.isActive("bulletList") && "bg-muted")}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						size="sm"
						title="Bullet List"
						type="button"
						variant="ghost"
					>
						<List className="size-4" />
					</Button>
					<Button
						className={cn(editor.isActive("orderedList") && "bg-muted")}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						size="sm"
						title="Numbered List"
						type="button"
						variant="ghost"
					>
						<ListOrdered className="size-4" />
					</Button>
					<Separator className="mx-1 h-6" orientation="vertical" />
					<Button
						className={cn(editor.isActive("link") && "bg-muted")}
						onClick={() => {
							setLinkUrl("");
							setIsLinkDialogOpen(true);
						}}
						size="sm"
						title="Add Link (Cmd+K)"
						type="button"
						variant="ghost"
					>
						<LinkIcon className="size-4" />
					</Button>
					<Button
						onClick={() => {
							setImageUrl("");
							setIsImageDialogOpen(true);
						}}
						size="sm"
						title="Add Image"
						type="button"
						variant="ghost"
					>
						<ImageIcon className="size-4" />
					</Button>
					<Button
						onClick={() =>
							editor
								.chain()
								.focus()
								.insertTable({ rows: 3, cols: 3, withHeaderRow: true })
								.run()
						}
						size="sm"
						title="Insert Table"
						type="button"
						variant="ghost"
					>
						<TableIcon className="size-4" />
					</Button>
					<Separator className="mx-1 h-6" orientation="vertical" />
					<Button
						size="sm"
						title="Mention Team Member (@)"
						type="button"
						variant="ghost"
					>
						<AtSign className="size-4" />
					</Button>
					<Separator className="mx-1 h-6" orientation="vertical" />

					{/* Add Widget Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								className="gap-1"
								size="sm"
								title="Add Widget"
								type="button"
								variant="ghost"
							>
								<Plus className="size-4" />
								<span className="text-xs">Add Widget</span>
								<ChevronDown className="size-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>Customer Sections</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "customerContactsBlock",
											attrs: {
												customerId,
												contactsCount: 0,
											},
										})
										.run();
								}}
							>
								<Users className="mr-2 size-4" />
								Additional Contacts
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "jobsTableBlock",
											attrs: {
												jobs: initialData?.jobs || [],
												customerId,
											},
										})
										.run();
								}}
							>
								<Briefcase className="mr-2 size-4" />
								Jobs Table
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "invoicesTableBlock",
											attrs: {
												invoices: initialData?.invoices || [],
												customerId,
											},
										})
										.run();
								}}
							>
								<DollarSign className="mr-2 size-4" />
								Invoices Table
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "equipmentTableBlock",
											attrs: {
												equipment: initialData?.equipment || [],
												customerId,
											},
										})
										.run();
								}}
							>
								<Wrench className="mr-2 size-4" />
								Equipment Table
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "documentsMediaBlock",
											attrs: {
												attachments: initialData?.attachments || [],
												properties: initialData?.properties || [],
												jobs: initialData?.jobs || [],
												customerId,
											},
										})
										.run();
								}}
							>
								<FileText className="mr-2 size-4" />
								Documents & Media
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Data Blocks</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "activityTimelineBlock",
											attrs: {
												activities: initialData?.activities || [],
											},
										})
										.run();
								}}
							>
								<Clock className="mr-2 size-4" />
								Activity Timeline
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									editor
										.chain()
										.focus()
										.insertContent({
											type: "metricsBlock",
											attrs: {
												metrics: initialData?.metrics || {},
											},
										})
										.run();
								}}
							>
								<LayoutGrid className="mr-2 size-4" />
								Metrics Dashboard
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Editor Content - No Padding, Full Width */}
			<EditorContent className="min-h-screen w-full" editor={editor} />

			{/* Helper Text at Bottom - Always show since always editable */}
			<div className="border-t bg-muted/30 px-4 py-3">
				<p className="text-muted-foreground text-xs">
					<kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
						/
					</kbd>{" "}
					for commands •{" "}
					<kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
						Cmd+B
					</kbd>{" "}
					bold •{" "}
					<kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
						Cmd+I
					</kbd>{" "}
					italic •{" "}
					<kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
						Cmd+K
					</kbd>{" "}
					link •{" "}
					<kbd className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
						@
					</kbd>{" "}
					mention team member
				</p>
			</div>

			{/* Link URL Input Dialog */}
			<Dialog onOpenChange={setIsLinkDialogOpen} open={isLinkDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Insert Link</DialogTitle>
						<DialogDescription>
							Enter the URL you want to link to.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="link-url">URL</Label>
							<Input
								autoFocus
								id="link-url"
								onChange={(e) => setLinkUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && linkUrl) {
										e.preventDefault();
										if (editor) {
											editor.chain().focus().setLink({ href: linkUrl }).run();
										}
										setIsLinkDialogOpen(false);
									}
								}}
								placeholder="https://example.com"
								type="url"
								value={linkUrl}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsLinkDialogOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={!linkUrl}
							onClick={() => {
								if (editor && linkUrl) {
									editor.chain().focus().setLink({ href: linkUrl }).run();
								}
								setIsLinkDialogOpen(false);
							}}
							type="button"
						>
							Insert Link
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Image URL Input Dialog */}
			<Dialog onOpenChange={setIsImageDialogOpen} open={isImageDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Insert Image</DialogTitle>
						<DialogDescription>
							Enter the URL of the image you want to insert.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="image-url">Image URL</Label>
							<Input
								autoFocus
								id="image-url"
								onChange={(e) => setImageUrl(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && imageUrl) {
										e.preventDefault();
										if (editor) {
											editor.chain().focus().setImage({ src: imageUrl }).run();
										}
										setIsImageDialogOpen(false);
									}
								}}
								placeholder="https://example.com/image.jpg"
								type="url"
								value={imageUrl}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => setIsImageDialogOpen(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={!imageUrl}
							onClick={() => {
								if (editor && imageUrl) {
									editor.chain().focus().setImage({ src: imageUrl }).run();
								}
								setIsImageDialogOpen(false);
							}}
							type="button"
						>
							Insert Image
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
