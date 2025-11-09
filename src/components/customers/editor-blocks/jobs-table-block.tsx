/**
 * Jobs Table Block - Custom Tiptap Node
 *
 * Displays customer's jobs using FullWidthDataTable
 * - Same design as main jobs page
 * - Searchable, sortable, filterable
 * - Click to view job details
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import { JobsTable } from "@/components/work/jobs-table";

// React component that renders the block
export function JobsTableBlockComponent({ node, editor }: any) {
  const { jobs, customerId } = node.attrs;
  const isEditable = editor.isEditable;

  const handleAddJob = () => {
    // Navigate to add job page with customer pre-selected
    window.location.href = `/dashboard/work/new?customerId=${customerId}`;
  };

  // Calculate job summary
  const inProgressJobs = (jobs || []).filter((job: any) => job.status === "in_progress");
  const scheduledJobs = (jobs || []).filter((job: any) => job.status === "scheduled");
  const completedJobs = (jobs || []).filter((job: any) => job.status === "completed");

  let summary = "";
  if (jobs.length === 0) {
    summary = "No jobs yet";
  } else if (inProgressJobs.length > 0) {
    summary = `${inProgressJobs.length} in progress, ${scheduledJobs.length} scheduled`;
  } else if (scheduledJobs.length > 0) {
    summary = `${scheduledJobs.length} scheduled`;
  } else {
    summary = `${completedJobs.length} completed`;
  }

  // Transform jobs to match Job type expected by JobsTable
  const transformedJobs = (jobs || []).map((job: any) => ({
    id: job.id,
    companyId: job.company_id,
    propertyId: job.property_id,
    customerId: job.customer_id,
    assignedTo: job.assigned_to,
    jobNumber: job.job_number,
    title: job.title,
    description: job.description,
    status: job.status,
    priority: job.priority,
    jobType: job.job_type,
    scheduledStart: job.scheduled_start ? new Date(job.scheduled_start) : null,
    scheduledEnd: job.scheduled_end ? new Date(job.scheduled_end) : null,
    actualStart: job.actual_start ? new Date(job.actual_start) : null,
    actualEnd: job.actual_end ? new Date(job.actual_end) : null,
    totalAmount: job.total_amount || 0,
    paidAmount: job.paid_amount || 0,
    notes: job.notes,
    metadata: job.metadata,
    createdAt: new Date(job.created_at),
    updatedAt: new Date(job.updated_at),
    aiCategories: job.ai_categories,
    aiEquipment: job.ai_equipment,
    aiServiceType: job.ai_service_type,
    aiPriorityScore: job.ai_priority_score,
    aiTags: job.ai_tags,
    aiProcessedAt: job.ai_processed_at ? new Date(job.ai_processed_at) : null,
  }));

  if (!jobs || jobs.length === 0) {
    return (
      <NodeViewWrapper className="jobs-table-block">
        <CollapsibleSectionWrapper
          title="Jobs (0)"
          icon={<Briefcase className="size-5" />}
          defaultOpen={false}
          storageKey="customer-jobs-section"
          summary="No jobs yet"
          actions={
            <Button
              size="sm"
              variant="ghost"
              onClick={handleAddJob}
              className="h-8 px-3 text-xs gap-1.5"
            >
              <Plus className="size-4" />
              Add Job
            </Button>
          }
        >
          <div className="rounded-lg border bg-muted/30 p-8 text-center">
            <Briefcase className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No jobs yet</p>
          </div>
        </CollapsibleSectionWrapper>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="jobs-table-block">
      <CollapsibleSectionWrapper
        title={`Jobs (${jobs.length})`}
        icon={<Briefcase className="size-5" />}
        defaultOpen={false}
        storageKey="customer-jobs-section"
        summary={summary}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddJob}
            className="gap-1"
          >
            <Plus className="size-4" />
            Add Job
          </Button>
        }
      >
        {/* Use same JobsTable component as jobs page */}
        <div className="-mx-6 -mt-6 -mb-6">
          <JobsTable
            jobs={transformedJobs}
            itemsPerPage={10}
          />
        </div>
      </CollapsibleSectionWrapper>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const JobsTableBlock = Node.create({
  name: "jobsTableBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      jobs: {
        default: [],
      },
      customerId: {
        default: null,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="jobs-table-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "jobs-table-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(JobsTableBlockComponent);
  },

  addCommands() {
    return {
      insertJobsTableBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    } as any;
  },
});
