"use client";

import {
	AlertCircle,
	Archive,
	Edit,
	Eye,
	FileText,
	Flag,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { bulkArchive } from "@/actions/archive";
import { ArchiveConfirmDialog } from "@/components/ui/archive-confirm-dialog";
import { Badge } from "@/components/ui/badge";
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	type BulkAction,
	type ColumnDef,
	FullWidthDataTable,
} from "@/components/ui/full-width-datatable";
import { TablePresets } from "@/lib/datatable/table-presets";
import { formatDate } from "@/lib/formatters";

type JobNote = {
	id: string;
	content: string;
	note_type?: string;
	is_important?: boolean;
	created_by_name?: string;
	created_at: string;
};

type JobNotesTableProps = {
	notes: JobNote[];
	onDeleteNote?: (
		noteId: string,
	) => Promise<{ success: boolean; error?: string }>;
};

export function JobNotesTable({ notes, onDeleteNote }: JobNotesTableProps) {
	const router = useRouter();
	const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);
	const [viewNoteId, setViewNoteId] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showArchiveDialog, setShowArchiveDialog] = useState(false);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const [isArchiving, setIsArchiving] = useState(false);

	const handleDeleteNote = useCallback(async () => {
		if (!deleteNoteId || !onDeleteNote) {
			return;
		}

		setIsDeleting(true);
		try {
			const result = await onDeleteNote(deleteNoteId);

			if (result.success) {
				toast.success("Note deleted");
				setDeleteNoteId(null);
				// Refresh to show updated list
				router.refresh();
			} else {
				toast.error(result.error || "Failed to delete note");
			}
		} catch (_error) {
			toast.error("Failed to delete note");
		} finally {
			setIsDeleting(false);
		}
	}, [deleteNoteId, onDeleteNote, router]);

	const handleArchive = useCallback(async () => {
		if (selectedIds.size === 0) {
			return;
		}

		setIsArchiving(true);
		try {
			const result = await bulkArchive(Array.from(selectedIds), "job_note");

			if (result.success && result.data) {
				toast.success(
					`Successfully archived ${result.data.archived} note${result.data.archived === 1 ? "" : "s"}`,
				);
				setShowArchiveDialog(false);
				setSelectedIds(new Set());
				router.refresh();
			} else {
				toast.error("Failed to archive notes");
			}
		} catch (_error) {
			toast.error("Failed to archive notes");
		} finally {
			setIsArchiving(false);
		}
	}, [selectedIds, router]);

	const getNoteTypeDisplay = useCallback((type?: string) => {
		if (!type) return "General";
		// Convert snake_case or kebab-case to Title Case
		return type
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}, []);

	const truncateContent = useCallback((content: string, maxLength = 100) => {
		if (content.length <= maxLength) return content;
		return `${content.substring(0, maxLength)}...`;
	}, []);

	const viewedNote = useMemo(
		() => notes.find((note) => note.id === viewNoteId),
		[notes, viewNoteId],
	);

	const bulkActions: BulkAction[] = useMemo(
		() => [
			{
				label: "Archive Selected",
				icon: <Archive className="h-4 w-4" />,
				variant: "destructive",
				onClick: (selectedIds: Set<string>) => {
					setSelectedIds(selectedIds);
					setShowArchiveDialog(true);
				},
			},
		],
		[],
	);

	const columns: ColumnDef<JobNote>[] = useMemo(
		() => [
			{
				key: "content",
				header: "Note",
				render: (note) => (
					<div className="flex items-start gap-2">
						{note.is_important && (
							<Flag className="text-destructive mt-0.5 size-4 shrink-0 fill-current" />
						)}
						<div className="flex flex-col gap-1">
							<span className="text-xs leading-tight">
								{truncateContent(note.content)}
							</span>
							{note.content.length > 100 && (
								<button
									className="text-primary text-xs font-medium hover:underline"
									onClick={(e) => {
										e.stopPropagation();
										setViewNoteId(note.id);
									}}
									type="button"
								>
									Read more
								</button>
							)}
						</div>
					</div>
				),
			},
			{
				key: "note_type",
				header: "Type",
				width: "w-28",
				shrink: true,
				hideOnMobile: true,
				render: (note) => (
					<Badge variant="outline" className="font-normal">
						{getNoteTypeDisplay(note.note_type)}
					</Badge>
				),
			},
			{
				key: "is_important",
				header: "Important",
				width: "w-24",
				shrink: true,
				hideOnMobile: true,
				align: "center",
				render: (note) =>
					note.is_important ? (
						<Flag className="text-destructive size-4 fill-current" />
					) : (
						<span className="text-muted-foreground text-xs">—</span>
					),
			},
			{
				key: "created_by_name",
				header: "Author",
				width: "w-36",
				shrink: true,
				hideOnMobile: true,
				render: (note) => (
					<span className="text-xs">{note.created_by_name || "Unknown"}</span>
				),
			},
			{
				key: "created_at",
				header: "Date",
				width: "w-32",
				shrink: true,
				render: (note) => (
					<span className="text-muted-foreground text-xs">
						{formatDate(note.created_at, "short")}
					</span>
				),
			},
			{
				key: "actions",
				header: "",
				width: "w-12",
				shrink: true,
				align: "right",
				render: (note) => {
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="size-8 p-0" size="sm" variant="ghost">
									<MoreHorizontal className="size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem
									className="cursor-pointer"
									onClick={() => setViewNoteId(note.id)}
								>
									<Eye className="mr-2 size-4" />
									View Full Note
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer">
									<Edit className="mr-2 size-4" />
									Edit Note
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive cursor-pointer"
									onClick={() => {
										setSelectedIds(new Set([note.id]));
										setShowArchiveDialog(true);
									}}
								>
									<Archive className="mr-2 size-4" />
									Archive Note
								</DropdownMenuItem>
								{onDeleteNote && (
									<>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-destructive focus:text-destructive cursor-pointer"
											onClick={() => setDeleteNoteId(note.id)}
										>
											<Trash2 className="mr-2 size-4" />
											Delete Note
										</DropdownMenuItem>
									</>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			},
		],
		[truncateContent, getNoteTypeDisplay, onDeleteNote],
	);

	return (
		<>
			<FullWidthDataTable
				{...TablePresets.compact()}
				bulkActions={bulkActions}
				columns={columns}
				data={notes}
				emptyIcon={<FileText className="text-muted-foreground/50 size-12" />}
				emptyMessage="No notes found for this job"
				getItemId={(note) => note.id}
				noPadding={true}
				searchFilter={(note, query) => {
					const searchLower = query.toLowerCase();
					return (
						note.content.toLowerCase().includes(searchLower) ||
						note.note_type?.toLowerCase().includes(searchLower) ||
						note.created_by_name?.toLowerCase().includes(searchLower)
					);
				}}
				searchPlaceholder="Search notes..."
				getRowClassName={(note) =>
					note.is_important ? "border-l-2 border-l-destructive" : ""
				}
			/>

			<ArchiveConfirmDialog
				entityType="note"
				isLoading={isArchiving}
				itemCount={selectedIds.size}
				onConfirm={handleArchive}
				onOpenChange={setShowArchiveDialog}
				open={showArchiveDialog}
			/>

			{/* View Note Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setViewNoteId(null)}
				open={viewNoteId !== null}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{viewedNote?.is_important && (
								<Flag className="text-destructive size-5 fill-current" />
							)}
							Note Details
						</DialogTitle>
					</DialogHeader>
					{viewedNote && (
						<div className="space-y-4">
							<div>
								<div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
									Type
								</div>
								<Badge variant="outline">
									{getNoteTypeDisplay(viewedNote.note_type)}
								</Badge>
							</div>
							<div>
								<div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
									Content
								</div>
								<p className="text-foreground text-xs leading-relaxed whitespace-pre-wrap">
									{viewedNote.content}
								</p>
							</div>
							<div className="border-border/40 flex items-center justify-between border-t pt-3">
								<div className="text-muted-foreground text-xs">
									Created by{" "}
									<span className="font-medium">
										{viewedNote.created_by_name || "Unknown"}
									</span>
								</div>
								<div className="text-muted-foreground text-xs">
									{formatDate(viewedNote.created_at, "datetime")}
								</div>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button onClick={() => setViewNoteId(null)} variant="outline">
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog
				onOpenChange={(open) => !open && setDeleteNoteId(null)}
				open={deleteNoteId !== null}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Note?</DialogTitle>
						<DialogDescription>
							This will permanently delete this note. This action cannot be
							undone. Are you sure you want to continue?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							disabled={isDeleting}
							onClick={() => setDeleteNoteId(null)}
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							disabled={isDeleting}
							onClick={handleDeleteNote}
							variant="destructive"
						>
							{isDeleting ? "Deleting..." : "Delete Note"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
