"use client";

/**
 * Customer Notes Table
 *
 * Displays customer notes in a paginated table with:
 * - Customer notes (visible to all)
 * - Internal notes (team only)
 * - Pin/unpin functionality
 * - Add new note inline
 * - Filter by type
 */

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCustomerNotes,
  createCustomerNote,
  deleteCustomerNote,
} from "@/actions/customer-notes";
import { type CustomerNote } from "@/types/customer-notes";
import { Archive, FileText, Lock, Pin, Trash2, Plus, User } from "lucide-react";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";

interface CustomerNotesTableProps {
  customerId: string;
  triggerAdd?: number; // Trigger to show add note form from external button
}

export function CustomerNotesTable({ customerId, triggerAdd }: CustomerNotesTableProps) {
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "customer" | "internal">("all");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteType, setNewNoteType] = useState<"customer" | "internal">("customer");

  const pageSize = 20;

  // Load notes
  useEffect(() => {
    loadNotes();
  }, [customerId, filterType, page]);

  // Respond to external trigger
  useEffect(() => {
    if (triggerAdd && triggerAdd > 0) {
      setShowAddNote(true);
    }
  }, [triggerAdd]);

  const loadNotes = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;

    const result = await createCustomerNote({
      customerId,
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
    if (!confirm("Archive this note? It can be restored within 90 days from the archive page.")) return;

    const result = await deleteCustomerNote(noteId); // Function already does soft delete
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
          <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
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
        <div className="space-y-3 rounded-lg border bg-muted/30 p-4 mx-4">
          <div className="flex items-center gap-2">
            <Select value={newNoteType} onValueChange={(v: any) => setNewNoteType(v)}>
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
            placeholder="Enter note content..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowAddNote(false);
                setNewNoteContent("");
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddNote}>
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
            {notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="size-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground text-sm">No notes found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>
                    {note.note_type === "internal" ? (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Lock className="size-3" />
                        Internal
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-xs">
                        <FileText className="size-3" />
                        Customer
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-start gap-2">
                      {note.is_pinned && (
                        <Pin className="mt-1 size-4 text-primary" fill="currentColor" />
                      )}
                      <p className="text-sm">{note.content}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="size-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">{note.user?.name || "Unknown"}</p>
                        <p className="text-muted-foreground text-xs">{note.user?.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground text-xs">
                      {formatDistance(new Date(note.created_at), new Date(), { addSuffix: true })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleArchiveNote(note.id)}
                      className="size-8 p-0"
                      title="Archive note"
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
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
