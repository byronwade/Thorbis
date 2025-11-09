"use client";

/**
 * Job Notes Table
 *
 * Displays job notes in a paginated table with:
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Pin/unpin functionality
 * - Add new note inline
 * - Filter by type
 */

import { formatDistance } from "date-fns";
import { Archive, FileText, Lock, Pin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { createJobNote, deleteJobNote, getJobNotes } from "@/actions/job-notes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { JobNote } from "@/types/job-notes";

type JobNotesTableProps = {
  jobId: string;
  triggerAdd?: number; // Trigger to show add note form from external button
};

export function JobNotesTable({ jobId, triggerAdd }: JobNotesTableProps) {
  const [notes, setNotes] = useState<JobNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "customer" | "internal">(
    "all"
  );
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState<"customer" | "internal">(
    "internal"
  );

  const pageSize = 20;

  // Load notes
  useEffect(() => {
    loadNotes();
  }, [jobId, filterType, page]);

  // Respond to external trigger
  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setShowAddNote(true);
    }
  }, [triggerAdd]);

  const loadNotes = async () => {
    setIsLoading(true);
    const result = await getJobNotes({
      jobId,
      noteType: filterType,
      limit: pageSize,
      offset: page * pageSize,
    });

    if (result.success) {
      setNotes(result.data || []);
      setTotalCount(result.count || 0);
    }
    setIsLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    const result = await createJobNote({
      jobId,
      content: newNoteContent,
      noteType: newNoteType,
    });

    if (result.success) {
      setNewNoteContent("");
      setShowAddNote(false);
      loadNotes();
    }
  };

  const handleArchiveNote = async (noteId: string) => {
    if (
      !confirm(
        "Archive this note? It can be restored within 90 days from the archive page."
      )
    )
      return;

    const result = await deleteJobNote(noteId);
    if (result.success) {
      loadNotes();
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-2">
          <Select
            onValueChange={(v: "all" | "customer" | "internal") =>
              setFilterType(v)
            }
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
              onValueChange={(v: "customer" | "internal") => setNewNoteType(v)}
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
            <Button onClick={handleAddNote} size="sm">
              Save Note
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
            {isLoading ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={5}>
                  <p className="text-muted-foreground text-sm">
                    Loading notes...
                  </p>
                </TableCell>
              </TableRow>
            ) : notes.length === 0 ? (
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
                      onClick={() => handleArchiveNote(note.id)}
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
    </div>
  );
}
