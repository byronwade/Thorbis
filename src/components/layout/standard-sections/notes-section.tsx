"use client";

import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UnifiedAccordionContent } from "@/components/ui/unified-accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface NotesSectionProps {
  notes: any[];
  entityType?: string;
  entityId?: string;
  onAddNote?: (content: string) => Promise<void>;
}

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
    } catch (error) {
      toast.error("Failed to add note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UnifiedAccordionContent>
      <div className="space-y-4">
        {/* Add Note Button/Form */}
        {onAddNote && (
          !isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Add Note
            </Button>
          ) : (
            <div className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note..."
                rows={3}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveNote}
                  disabled={isSaving}
                  size="sm"
                >
                  {isSaving ? "Saving..." : "Save Note"}
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )
        )}

        {/* Notes List */}
        {notes && notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note: any) => (
              <div
                key={note.id}
                className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex gap-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={note.user?.avatar} />
                    <AvatarFallback>
                      {note.user?.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">{note.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(new Date(note.created_at), new Date(), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="mt-1 text-sm whitespace-pre-wrap break-words">
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
              <p className="mt-2 text-sm text-muted-foreground">No notes yet</p>
            </div>
          </div>
        )}
      </div>
    </UnifiedAccordionContent>
  );
}

