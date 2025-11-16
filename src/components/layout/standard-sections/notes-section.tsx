"use client";

import { formatDistance } from "date-fns";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";
import { useToast } from "@/hooks/use-toast";

type NotesSectionProps = {
	notes: any[];
	entityType?: string;
	entityId?: string;
	onAddNote?: (content: string) => Promise<void>;
};

export function NotesSection({
	notes,
	entityType,
	entityId,
	onAddNote,
}: NotesSectionProps) {
	const { toast } = useToast();
	const [isAdding, setIsAdding] = useState(false);
	const [newNote, setNewNote] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const handleSaveNote = async () => {
		if (!onAddNote) {
			return;
		}

		if (!newNote.trim()) {
			toast.error("Please enter a note");
			return;
		}

		setIsSaving(true);
		try {
			await onAddNote(newNote);
			toast.success("Note added successfully");
			setNewNote("");
			setIsAdding(false);
		} catch (_error) {
			toast.error("Failed to add note");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<UnifiedAccordionContent>
			<div className="space-y-4">
				{/* Add Note Button/Form */}
				{onAddNote &&
					(isAdding ? (
						<div className="space-y-2">
							<Textarea
								autoFocus
								onChange={(e) => setNewNote(e.target.value)}
								placeholder="Enter your note..."
								rows={3}
								value={newNote}
							/>
							<div className="flex gap-2">
								<Button disabled={isSaving} onClick={handleSaveNote} size="sm">
									{isSaving ? "Saving..." : "Save Note"}
								</Button>
								<Button
									onClick={() => {
										setIsAdding(false);
										setNewNote("");
									}}
									size="sm"
									variant="outline"
								>
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<Button
							className="w-full"
							onClick={() => setIsAdding(true)}
							size="sm"
							variant="outline"
						>
							<Plus className="mr-2 size-4" />
							Add Note
						</Button>
					))}

				{/* Notes List */}
				{notes && notes.length > 0 ? (
					<div className="space-y-3">
						{notes.map((note: any) => (
							<div
								className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
								key={note.id}
							>
								<div className="flex gap-3">
									<Avatar className="size-8 flex-shrink-0">
										<AvatarImage src={note.user?.avatar} />
										<AvatarFallback>
											{note.user?.name?.charAt(0) || "?"}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between gap-2">
											<p className="font-medium text-xs">{note.user?.name}</p>
											<p className="text-muted-foreground text-xs">
												{formatDistance(new Date(note.created_at), new Date(), {
													addSuffix: true,
												})}
											</p>
										</div>
										<p className="mt-1 whitespace-pre-wrap break-words text-sm">
											{note.content || note.note}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex h-32 items-center justify-center">
						<div className="text-center">
							<FileText className="mx-auto size-8 text-muted-foreground/50" />
							<p className="mt-2 text-muted-foreground text-sm">No notes yet</p>
						</div>
					</div>
				)}
			</div>
		</UnifiedAccordionContent>
	);
}
