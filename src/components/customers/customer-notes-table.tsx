"use client";

/**
 * Customer Notes Table - React Query Refactored
 *
 * Performance optimizations:
 * - Uses React Query for automatic caching and refetching
 * - Optimistic updates for instant UI feedback
 * - Automatic background refetching
 * - Intelligent cache invalidation
 *
 * Displays customer notes in a paginated table with:
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Pin/unpin functionality
 * - Add new note inline
 * - Filter by type
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistance } from "date-fns";
import { Archive, FileText, Lock, Pin, User } from "lucide-react";
import { useEffect, useState } from "react";
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
	triggerAdd?: number; // Trigger to show add note form from external button
};

export function CustomerNotesTable({
	customerId,
	triggerAdd,
}: CustomerNotesTableProps) {
	const queryClient = useQueryClient();

	// Local UI state (not data state)
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

	const pageSize = 20;

	// React Query: Fetch notes with automatic caching and refetching
	const {
		data: notesData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["customer-notes", customerId, filterType, page, pageSize],
		queryFn: async () => {
			const result = await getCustomerNotes({
				customerId,
				noteType: filterType,
				limit: pageSize,
				offset: page * pageSize,
			});
			if (!result.success) {
				throw new Error(result.error || "Failed to fetch notes");
			}
			return {
				notes: result.data || [],
				count: result.count || 0,
			};
		},
		staleTime: 30 * 1000, // Consider data fresh for 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
	});

	// React Query: Add note mutation with optimistic update
	const addNoteMutation = useMutation({
		mutationFn: async (data: {
			content: string;
			noteType: "customer" | "internal";
		}) => {
			const result = await createCustomerNote({
				customerId,
				content: data.content,
				noteType: data.noteType,
			});
			if (!result.success) {
				throw new Error(result.error || "Failed to create note");
			}
			return result;
		},
		onSuccess: () => {
			// Invalidate and refetch notes
			queryClient.invalidateQueries({
				queryKey: ["customer-notes", customerId],
			});
			setNewNoteContent("");
			setShowAddNote(false);
		},
	});

	// React Query: Archive note mutation with optimistic update
	const archiveNoteMutation = useMutation({
		mutationFn: async (noteId: string) => {
			const result = await deleteCustomerNote(noteId);
			if (!result.success) {
				throw new Error(result.error || "Failed to archive note");
			}
			return result;
		},
		onMutate: async (noteId) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({
				queryKey: ["customer-notes", customerId],
			});

			// Snapshot previous value
			const previousNotes = queryClient.getQueryData([
				"customer-notes",
				customerId,
				filterType,
				page,
				pageSize,
			]);

			// Optimistically update (remove note from UI immediately)
			queryClient.setQueryData(
				["customer-notes", customerId, filterType, page, pageSize],
				(old: any) =>
					old
						? {
								...old,
								notes: old.notes.filter(
									(note: CustomerNote) => note.id !== noteId,
								),
								count: old.count - 1,
							}
						: old,
			);

			return { previousNotes };
		},
		onError: (_err, _noteId, context) => {
			// Rollback on error
			if (context?.previousNotes) {
				queryClient.setQueryData(
					["customer-notes", customerId, filterType, page, pageSize],
					context.previousNotes,
				);
			}
		},
		onSettled: () => {
			// Always refetch after mutation
			queryClient.invalidateQueries({
				queryKey: ["customer-notes", customerId],
			});
		},
	});

	// Respond to external trigger
	useEffect(() => {
		if (triggerAdd && triggerAdd > 0) {
			setShowAddNote(true);
		}
	}, [triggerAdd]);

	// Handlers
	const handleAddNote = () => {
		if (!newNoteContent.trim()) return;
		addNoteMutation.mutate({
			content: newNoteContent,
			noteType: newNoteType,
		});
	};

	const handleArchiveNote = async (noteId: string) => {
		archiveNoteMutation.mutate(noteId);
	};

	const notes = notesData?.notes || [];
	const totalCount = notesData?.count || 0;
	const totalPages = Math.ceil(totalCount / pageSize);

	// Loading skeleton
	if (isLoading) {
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
	if (error) {
		return (
			<div className="flex min-h-[400px] items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 p-8">
				<div className="text-center">
					<p className="mb-2 font-semibold text-destructive">
						Failed to load notes
					</p>
					<p className="text-muted-foreground text-sm">{error.message}</p>
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
				<div className="mx-4 space-y-3 rounded-lg border bg-muted/30 p-4">
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
						<Button
							disabled={addNoteMutation.isPending}
							onClick={handleAddNote}
							size="sm"
						>
							{addNoteMutation.isPending ? "Saving..." : "Save Note"}
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
						{notes.length === 0 ? (
							<TableRow>
								<TableCell className="h-24 text-center" colSpan={5}>
									<div className="flex flex-col items-center gap-2">
										<FileText className="size-8 text-muted-foreground/50" />
										<p className="text-muted-foreground text-sm">
											No notes found
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							notes.map((note) => (
								<TableRow key={note.id}>
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
													className="mt-1 size-4 text-primary"
													fill="currentColor"
												/>
											)}
											<p className="text-sm">{note.content}</p>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<User className="size-4 text-muted-foreground" />
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
											disabled={archiveNoteMutation.isPending}
											onClick={() => {
												setItemToArchive(note.id);
												setIsArchiveDialogOpen(true);
											}}
											size="sm"
											title="Archive note"
											variant="ghost"
										>
											<Archive className="size-4 text-destructive" />
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
