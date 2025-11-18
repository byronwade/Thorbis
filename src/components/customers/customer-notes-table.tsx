"use client";

/**
 * Customer Notes Table - Server Actions + useOptimistic (React 19)
 *
 * Performance optimizations:
 * - Server Components for data fetching (when possible)
 * - useOptimistic for instant UI feedback
 * - Server Actions for mutations with auto-revalidation
 * - No external state management needed
 *
 * Displays customer notes in a paginated table with:
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Pin/unpin functionality
 * - Add new note inline
 * - Filter by type
 */

import { formatDistance } from "date-fns";
import { Archive, FileText, Lock, Pin, User } from "lucide-react";
import {
	useActionState,
	useEffect,
	useOptimistic,
	useState,
	useTransition,
} from "react";
import {
	createCustomerNote,
	deleteCustomerNote,
	getCustomerNotes,
} from "@/actions/customer-notes";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { CustomerNote } from "@/types/customer-notes";

type CustomerNotesTableProps = {
	customerId: string;
	initialNotes?: CustomerNote[];
	initialCount?: number;
	triggerAdd?: number;
};

export function CustomerNotesTable({
	customerId,
	initialNotes = [],
	initialCount = 0,
	triggerAdd,
}: CustomerNotesTableProps) {
	// Local UI state
	const [filterType, setFilterType] = useState<"all" | "customer" | "internal">(
		"all",
	);
	const [page, setPage] = useState(0);
	const [showAddNote, setShowAddNote] = useState(false);
	const [newNoteContent, setNewNoteContent] = useState("");
	const [newNoteType, setNewNoteType] = useState<"customer" | "internal">(
		"customer",
	);
	const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
	const [itemToArchive, setItemToArchive] = useState<string | null>(null);

	// Data state
	const [notes, setNotes] = useState<CustomerNote[]>(initialNotes);
	const [totalCount, setTotalCount] = useState(initialCount);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isPending, startTransition] = useTransition();
	const [optimisticNotes, addOptimisticNote] = useOptimistic(
		notes,
		(state, newNote: CustomerNote | { id: string; action: "delete" }) => {
			if ("action" in newNote && newNote.action === "delete") {
				return state.filter((note) => note.id !== newNote.id);
			}
			return [newNote as CustomerNote, ...state];
		},
	);

	const pageSize = 20;

	// Fetch notes when filters/page change
	useEffect(() => {
		const loadNotes = async () => {
			setIsLoading(true);
			setError(null);

			const result = await getCustomerNotes({
				customerId,
				noteType: filterType,
				limit: pageSize,
				offset: page * pageSize,
			});

			if (!result.success) {
				setError(result.error || "Failed to fetch notes");
			} else {
				setNotes(result.data || []);
				setTotalCount(result.count || 0);
			}

			setIsLoading(false);
		};

		loadNotes();
	}, [customerId, filterType, page]);

	// Respond to external trigger
	useEffect(() => {
		if (triggerAdd && triggerAdd > 0) {
			setShowAddNote(true);
		}
	}, [triggerAdd]);

	// Handlers
	const handleAddNote = async () => {
		if (!newNoteContent.trim()) return;

		const tempNote: CustomerNote = {
			id: `temp-${Date.now()}`,
			customer_id: customerId,
			content: newNoteContent,
			note_type: newNoteType,
			is_pinned: false,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			user_id: "",
			company_id: "",
			deleted_at: null,
			user: null,
		};

		startTransition(async () => {
			addOptimisticNote(tempNote);

			const result = await createCustomerNote({
				customerId,
				content: newNoteContent,
				noteType: newNoteType,
			});

			if (result.success) {
				setNewNoteContent("");
				setShowAddNote(false);
				// Refresh data
				const refreshResult = await getCustomerNotes({
					customerId,
					noteType: filterType,
					limit: pageSize,
					offset: page * pageSize,
				});
				if (refreshResult.success) {
					setNotes(refreshResult.data || []);
					setTotalCount(refreshResult.count || 0);
				}
			}
		});
	};

	const handleArchiveNote = async (noteId: string) => {
		startTransition(async () => {
			addOptimisticNote({ id: noteId, action: "delete" });

			await deleteCustomerNote(noteId);

			// Refresh data
			const result = await getCustomerNotes({
				customerId,
				noteType: filterType,
				limit: pageSize,
				offset: page * pageSize,
			});

			if (result.success) {
				setNotes(result.data || []);
				setTotalCount(result.count || 0);
			}
		});
	};

	const totalPages = Math.ceil(totalCount / pageSize);

	// Loading skeleton
	if (isLoading && notes.length === 0) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4 p-4">
					<Skeleton className="h-10 w-[180px]" />
				</div>
				<div className="rounded-lg border p-4">
					<Skeleton className="mb-4 h-8 w-full" />
					<Skeleton className="mb-2 h-12 w-full" />
					<Skeleton className="mb-2 h-12 w-full" />
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		);
	}

	// Error state
	if (error && notes.length === 0) {
		return (
			<div className="border-destructive/50 bg-destructive/10 flex min-h-[400px] items-center justify-center rounded-lg border p-8">
				<div className="text-center">
					<p className="text-destructive mb-2 font-semibold">
						Failed to load notes
					</p>
					<p className="text-muted-foreground text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-4 p-4">
				<div className="flex items-center gap-2">
					<Select
						onValueChange={(v: any) => setFilterType(v)}
						value={filterType}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Notes ({totalCount})</SelectItem>
							<SelectItem value="customer">Customer Notes</SelectItem>
							<SelectItem value="internal">Internal Notes</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Add Note Form */}
			{showAddNote && (
				<div className="bg-muted/30 mx-4 space-y-3 rounded-lg border p-4">
					<div className="flex items-center gap-2">
						<Select
							onValueChange={(v: any) => setNewNoteType(v)}
							value={newNoteType}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="customer">
									<div className="flex items-center gap-2">
										<FileText className="size-4" />
										Customer Note
									</div>
								</SelectItem>
								<SelectItem value="internal">
									<div className="flex items-center gap-2">
										<Lock className="size-4" />
										Internal Note
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Textarea
						onChange={(e) => setNewNoteContent(e.target.value)}
						placeholder="Enter note content..."
						rows={3}
						value={newNoteContent}
					/>
					<div className="flex justify-end gap-2">
						<Button
							onClick={() => {
								setShowAddNote(false);
								setNewNoteContent("");
							}}
							size="sm"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button disabled={isPending} onClick={handleAddNote} size="sm">
							{isPending ? "Saving..." : "Save Note"}
						</Button>
					</div>
				</div>
			)}

			{/* Notes Table */}
			<div className="rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Type</TableHead>
							<TableHead>Note</TableHead>
							<TableHead className="w-[200px]">Created By</TableHead>
							<TableHead className="w-[150px]">Date</TableHead>
							<TableHead className="w-[80px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{optimisticNotes.length === 0 ? (
							<TableRow>
								<TableCell className="h-24 text-center" colSpan={5}>
									<div className="flex flex-col items-center gap-2">
										<FileText className="text-muted-foreground/50 size-8" />
										<p className="text-muted-foreground text-sm">
											No notes found
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							optimisticNotes.map((note) => (
								<TableRow
									key={note.id}
									style={{ opacity: note.id.startsWith("temp-") ? 0.5 : 1 }}
								>
									<TableCell>
										{note.note_type === "internal" ? (
											<Badge className="gap-1 text-xs" variant="secondary">
												<Lock className="size-3" />
												Internal
											</Badge>
										) : (
											<Badge className="gap-1 text-xs" variant="outline">
												<FileText className="size-3" />
												Customer
											</Badge>
										)}
									</TableCell>
									<TableCell className="max-w-md">
										<div className="flex items-start gap-2">
											{note.is_pinned && (
												<Pin
													className="text-primary mt-1 size-4"
													fill="currentColor"
												/>
											)}
											<p className="text-sm">{note.content}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<User className="text-muted-foreground size-4" />
											<div className="text-sm">
												<p className="font-medium">
													{note.user?.name || "Unknown"}
												</p>
												<p className="text-muted-foreground text-xs">
													{note.user?.email}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<p className="text-muted-foreground text-xs">
											{formatDistance(new Date(note.created_at), new Date(), {
												addSuffix: true,
											})}
										</p>
									</TableCell>
									<TableCell>
										<Button
											className="size-8 p-0"
											disabled={isPending || note.id.startsWith("temp-")}
											onClick={() => {
												setItemToArchive(note.id);
												setIsArchiveDialogOpen(true);
											}}
											size="sm"
											title="Archive note"
											variant="ghost"
										>
											<Archive className="text-destructive size-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-sm">
						Showing {page * pageSize + 1}-
						{Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
					</p>
					<div className="flex gap-2">
						<Button
							disabled={page === 0}
							onClick={() => setPage(page - 1)}
							size="sm"
							variant="outline"
						>
							Previous
						</Button>
						<Button
							disabled={page >= totalPages - 1}
							onClick={() => setPage(page + 1)}
							size="sm"
							variant="outline"
						>
							Next
						</Button>
					</div>
				</div>
			)}

			{/* Archive Note Dialog */}
			<AlertDialog
				onOpenChange={setIsArchiveDialogOpen}
				open={isArchiveDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Archive Note?</AlertDialogTitle>
						<AlertDialogDescription>
							This note will be archived and can be restored within 90 days from
							the archive page.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							onClick={async () => {
								if (itemToArchive) {
									await handleArchiveNote(itemToArchive);
								}
							}}
						>
							Archive
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
