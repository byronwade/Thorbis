/**
 * Technician Job Info
 * Shows job execution data: property, equipment, documents, notes
 */

"use client";

import {
  Wrench,
  FileText,
  Camera,
  StickyNote,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type TechJobInfoProps = {
  property?: {
    id: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    zip_code?: string | null;
    best_access_time?: string | null;
    parking_instructions?: string | null;
    service_entrance_notes?: string | null;
  };
  equipment?: Array<{
    id: string;
    equipment_type?: string;
    model?: string;
    serial_number?: string;
    status?: string;
  }>;
  jobEquipment?: Array<{
    id: string;
    equipment_id?: string;
    action?: string;
    notes?: string;
  }>;
  documents?: Array<{
    id: string;
    title?: string;
    type?: string;
    created_at: string;
  }>;
  photos?: Array<{
    id: string;
    category?: string;
    created_at: string;
  }>;
  notes?: Array<{
    id: string;
    content?: string;
    note_type?: string;
    is_important?: boolean;
    created_at: string;
  }>;
  materials?: Array<{
    id: string;
    material_name?: string;
    quantity?: number;
    unit?: string;
  }>;
};

export function TechJobInfo({
  property,
  equipment = [],
  jobEquipment = [],
  documents = [],
  photos = [],
  notes = [],
  materials = [],
}: TechJobInfoProps) {
  const importantNotes = notes.filter((n) => n.is_important);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Equipment on Site */}
      {(equipment.length > 0 || jobEquipment.length > 0) && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <Wrench className="size-4" />
              {equipment.length + jobEquipment.length} Equipment
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Equipment on Site</h4>
                <p className="text-muted-foreground text-xs">
                  Units to service on this job
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {equipment.map((eq) => (
                  <div
                    className="flex items-start justify-between rounded-md bg-muted/50 p-2"
                    key={eq.id}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-sm">
                        {eq.equipment_type || "Equipment"}
                      </span>
                      {eq.model && (
                        <span className="text-muted-foreground text-xs">
                          Model: {eq.model}
                        </span>
                      )}
                      {eq.serial_number && (
                        <span className="text-muted-foreground text-xs">
                          S/N: {eq.serial_number}
                        </span>
                      )}
                    </div>
                    {eq.status && (
                      <Badge className="capitalize shrink-0" variant="outline">
                        {eq.status}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Materials Needed */}
      {materials.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
              <Package className="size-4" />
              {materials.length} Material{materials.length !== 1 ? "s" : ""}
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-72" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Materials List</h4>
                <p className="text-muted-foreground text-xs">
                  Items needed for this job
                </p>
              </div>
              <Separator />
              <div className="space-y-1">
                {materials.map((material) => (
                  <div
                    className="flex items-center justify-between text-sm"
                    key={material.id}
                  >
                    <span>{material.material_name}</span>
                    <span className="text-muted-foreground">
                      {material.quantity} {material.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Important Notes */}
      {importantNotes.length > 0 && (
        <HoverCard openDelay={200}>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 font-medium text-sm text-red-700 transition-colors hover:border-red-300 hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
              <AlertCircle className="size-4" />
              {importantNotes.length} Important
            </button>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="w-80" side="bottom">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Important Notes</h4>
                <p className="text-muted-foreground text-xs">
                  Critical information for this job
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                {importantNotes.map((note) => (
                  <div
                    className="rounded-md border-l-2 border-destructive bg-destructive/10 p-2"
                    key={note.id}
                  >
                    <p className="text-sm">{note.content}</p>
                    {note.note_type && (
                      <Badge className="mt-1 capitalize" variant="outline">
                        {note.note_type}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
          <FileText className="size-4" />
          {documents.length} Doc{documents.length !== 1 ? "s" : ""}
        </button>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
          <Camera className="size-4" />
          {photos.length} Photo{photos.length !== 1 ? "s" : ""}
        </button>
      )}

      {/* All Notes Count */}
      {notes.length > 0 && (
        <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 font-medium text-sm transition-colors hover:border-primary/50 hover:bg-primary/5">
          <StickyNote className="size-4" />
          {notes.length} Note{notes.length !== 1 ? "s" : ""}
        </button>
      )}

      {/* Completion Status */}
      {jobEquipment.length > 0 &&
        jobEquipment.every((je) => je.action === "completed") && (
          <button className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 font-medium text-sm text-green-700 transition-colors hover:border-green-300 hover:bg-green-100 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle className="size-4" />
            All Tasks Complete
          </button>
        )}
    </div>
  );
}
