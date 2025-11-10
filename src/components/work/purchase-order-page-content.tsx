/**
 * Purchase Order Page Content
 *
 * Comprehensive purchase order details with collapsible sections
 * Matches job, customer, appointment, team member detail page patterns
 *
 * Sections:
 * - PO Information (number, vendor, dates, priority)
 * - Line Items (materials/items being ordered)
 * - Job Details (if linked to a job)
 * - Delivery Information (address, expected date, tracking)
 * - Activity Log (PO history and changes)
 */

"use client";

import {
  Package,
  Building2,
  Calendar,
  MapPin,
  FileText,
  Activity,
  Wrench,
  Phone,
  Mail,
  Save,
  X,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  User,
  DollarSign,
  Paperclip,
  FileCheck,
  AlertCircle,
  MoreVertical,
  Edit,
  Pencil,
  ChevronRight,
} from "lucide-react";
import { ActivityLogSection } from "@/components/layout/standard-sections/activity-log-section";
import { AttachmentsSection } from "@/components/layout/standard-sections/attachments-section";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
} from "@/components/ui/accordion";
import {
  UnifiedAccordion,
  UnifiedAccordionContent,
} from "@/components/ui/unified-accordion";
import { CollapsibleDataSection, CollapsibleActionButton } from "@/components/ui/collapsible-data-section";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";
import { VendorSelect } from "@/components/inventory/vendor-select";
import { updatePurchaseOrderVendor } from "@/actions/purchase-orders";

export type PurchaseOrderData = {
  purchaseOrder: any;
  job?: any;
  lineItems?: any[];
  activities?: any[];
  attachments?: any[];
  requestedByUser?: any;
  approvedByUser?: any;
};

export type PurchaseOrderPageContentProps = {
  entityData: PurchaseOrderData;
  metrics: any;
};

const defaultAccordionSections = [
  "line-items",
];

export function PurchaseOrderPageContent({
  entityData,
  metrics,
}: PurchaseOrderPageContentProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    purchaseOrder: po,
    job,
    lineItems = [],
    activities = [],
    attachments = [],
    requestedByUser,
    approvedByUser,
  } = entityData;

  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(po.status || "draft");
  const [statusUpdateNotes, setStatusUpdateNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isEditingVendor, setIsEditingVendor] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>(po.vendor_id);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [isUpdatingVendor, setIsUpdatingVendor] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("line-items");

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex-1 p-6">Loading...</div>;
  }

  // Prepare unified accordion sections
  const accordionSections: any[] = [
    // Line Items
    {
      id: "line-items",
      title: "Line Items",
      count: lineItems.length,
      defaultOpen: true,
      content: (
        <UnifiedAccordionContent>
          {lineItems.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="min-w-[200px]">Description</TableHead>
                    <TableHead className="text-right w-24">Ordered</TableHead>
                    {(po.status === "partially_received" ||
                      po.status === "received" ||
                      lineItems.some((item: any) => item.received_quantity > 0)) && (
                      <TableHead className="text-right w-24">Received</TableHead>
                    )}
                    <TableHead className="text-right w-32">Unit Price</TableHead>
                    <TableHead className="text-right w-32">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item: any) => {
                    const receivedQty = item.received_quantity || 0;
                    const orderedQty = item.quantity || 0;
                    const isFullyReceived = receivedQty >= orderedQty;
                    const isPartiallyReceived = receivedQty > 0 && receivedQty < orderedQty;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {item.description}
                            {isFullyReceived && (
                              <CheckCircle2
                                className="size-4 text-green-600"
                                aria-label="Fully received"
                              />
                            )}
                            {isPartiallyReceived && (
                              <Clock
                                className="size-4 text-yellow-600"
                                aria-label="Partially received"
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{orderedQty}</TableCell>
                        {(po.status === "partially_received" ||
                          po.status === "received" ||
                          receivedQty > 0) && (
                          <TableCell className="text-right">
                            <span
                              className={
                                isFullyReceived
                                  ? "text-green-600 font-semibold"
                                  : isPartiallyReceived
                                  ? "text-yellow-600"
                                  : ""
                              }
                            >
                              {receivedQty}
                            </span>
                            {isPartiallyReceived && (
                              <span className="text-muted-foreground text-xs ml-1">
                                ({orderedQty - receivedQty} remaining)
                              </span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format((item.unit_price || 0) / 100)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format((orderedQty * (item.unit_price || 0)) / 100)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Total Row */}
                  <TableRow className="border-t-2 bg-muted/50">
                    <TableCell
                      colSpan={
                        po.status === "partially_received" ||
                        po.status === "received" ||
                        lineItems.some((item: any) => item.received_quantity > 0)
                          ? 4
                          : 3
                      }
                      className="font-semibold text-right"
                    >
                      Total
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(
                        lineItems.reduce(
                          (sum: number, item: any) =>
                            sum + (item.quantity || 0) * (item.unit_price || 0),
                          0
                        ) / 100
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto size-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground text-sm">No line items yet</p>
                <p className="text-muted-foreground text-xs">
                  Add items to this purchase order
                </p>
              </div>
            </div>
          )}
        </UnifiedAccordionContent>
      ),
    },
  ];

  // Add Job Details section if job exists
  if (job) {
    accordionSections.push({
      id: "job-details",
      title: "Related Job",
      icon: <Wrench className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Job Number</Label>
              <Link
                href={`/dashboard/work/${job.id}`}
                className="block font-medium text-primary text-sm hover:underline"
              >
                #{job.job_number}
              </Link>
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <p className="text-sm">{job.title}</p>
            </div>
          </div>
        </UnifiedAccordionContent>
      ),
    });
  }

  // Add Delivery section if applicable
  if (po.delivery_address || po.tracking_number) {
    accordionSections.push({
      id: "delivery",
      title: "Delivery Details",
      icon: <MapPin className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div className="space-y-3">
            {po.delivery_address && (
              <div>
                <Label className="text-xs">Delivery Address</Label>
                <p className="text-sm whitespace-pre-line">{po.delivery_address}</p>
              </div>
            )}
            {po.tracking_number && (
              <div>
                <Label className="text-xs">Tracking Number</Label>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm">{po.tracking_number}</p>
                  <Button asChild size="sm" variant="ghost" className="h-6 px-2">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        po.tracking_number
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Track
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </UnifiedAccordionContent>
      ),
    });
  }

  // Add Attachments section
  accordionSections.push({
    id: "attachments",
    title: "Attachments",
    icon: <Paperclip className="size-4" />,
    count: attachments.length,
    content: (
      <UnifiedAccordionContent>
        {attachments.length > 0 ? (
          <div className="space-y-2">
            {attachments.map((attachment: any) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between rounded-lg border p-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {attachment.original_file_name || attachment.file_name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {attachment.file_size
                        ? `${(attachment.file_size / 1024).toFixed(1)} KB`
                        : ""}
                      {attachment.category && ` • ${attachment.category}`}
                    </p>
                  </div>
                </div>
                <Button asChild size="sm" variant="ghost">
                  <a
                    href={attachment.storage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="size-4" />
                  </a>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-sm">No attachments yet</p>
        )}
      </UnifiedAccordionContent>
    ),
  });

  // Add Notes section if applicable
  if (po.notes || po.internal_notes) {
    accordionSections.push({
      id: "notes",
      title: "Notes",
      icon: <FileText className="size-4" />,
      content: (
        <UnifiedAccordionContent>
          <div className="space-y-4">
            {po.notes && (
              <div>
                <Label className="text-xs">Public Notes</Label>
                <p className="mt-1 whitespace-pre-wrap text-sm">{po.notes}</p>
              </div>
            )}
            {po.internal_notes && (
              <div>
                <Label className="text-xs">Internal Notes</Label>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {po.internal_notes}
                </p>
              </div>
            )}
          </div>
        </UnifiedAccordionContent>
      ),
    });
  }

  // Add Documents section (renamed from attachments to avoid duplicate key)
  accordionSections.push({
    id: "documents",
    title: "Documents",
    icon: <Paperclip className="size-4" />,
    count: attachments.length,
    content: <AttachmentsSection attachments={attachments} />,
  });

  // Add Activity section
  accordionSections.push({
    id: "activity",
    title: "Activity",
    icon: <Activity className="size-4" />,
    count: activities.length,
    content: <ActivityLogSection activities={activities} />,
  });

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6">
        {/* Desktop Title and Actions */}
        <div className="hidden flex-row items-center justify-between lg:flex">
          <div className="flex flex-row items-center gap-2">
            <h1 className="text-2xl font-semibold">{po.title}</h1>
          </div>
          <div className="flex h-min gap-2">
            {/* Print PO */}
            <Button
              onClick={() => window.print()}
              size="sm"
              variant="outline"
            >
              <Printer className="mr-2 size-4" />
              Print
            </Button>

            {/* Email Vendor */}
            {po.vendor_email && (
              <Button
                asChild
                size="sm"
                variant="outline"
              >
                <a href={`mailto:${po.vendor_email}?subject=Purchase Order ${po.po_number || po.poNumber}`}>
                  <Mail className="mr-2 size-4" />
                  Email Vendor
                </a>
              </Button>
            )}

            {/* Status Update Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("pending_approval");
                    setStatusUpdateDialogOpen(true);
                  }}
                >
                  Request Approval
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("approved");
                    setStatusUpdateDialogOpen(true);
                  }}
                >
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("ordered");
                    setStatusUpdateDialogOpen(true);
                  }}
                >
                  Mark as Ordered
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("partially_received");
                    setStatusUpdateDialogOpen(true);
                  }}
                >
                  Partially Received
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("received");
                    setStatusUpdateDialogOpen(true);
                  }}
                >
                  Mark as Received
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus("cancelled");
                    setStatusUpdateDialogOpen(true);
                  }}
                  className="text-destructive"
                >
                  Cancel PO
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="rounded-md bg-muted/50 shadow-sm">
          <div className="flex flex-col gap-4 overflow-hidden p-4 sm:p-6 md:flex-row">
            {/* Left Side - Status Preview */}
            <div className="flex flex-col gap-3">
              <div className="aspect-[16/10] lg:w-[400px] md:w-[320px] w-full">
                <div className="size-full p-0 border border-solid border-border rounded-lg flex flex-none justify-center overflow-hidden w-full">
                  <div className="w-full">
                    {/* Status Header */}
                    <div className="border-b border-solid border-border w-full p-3">
                      <div className="flex items-center gap-2">
                        {po.status === "received" ? (
                          <CheckCircle2 className="size-4 text-green-600" />
                        ) : po.status === "cancelled" ? (
                          <AlertCircle className="size-4 text-destructive" />
                        ) : (
                          <Clock className="size-4 text-yellow-600" />
                        )}
                        <h3 className="text-sm font-medium">
                          {po.status?.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Draft"}
                        </h3>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-3 flex flex-col h-[calc(100%-45px)]">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">PO Number</p>
                          <p className="text-sm font-medium">{po.po_number || po.poNumber}</p>
                        </div>
                        {po.vendor && (
                          <div>
                            <p className="text-xs text-muted-foreground">Vendor</p>
                            <p className="text-sm font-medium">{po.vendor}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Title and Actions */}
              <div className="flex h-min gap-2 flex-wrap lg:hidden">
                {/* Print PO */}
                <Button
                  onClick={() => window.print()}
                  size="sm"
                  variant="outline"
                  className="flex-1 min-w-[96px]"
                >
                  <Printer className="mr-2 size-4" />
                  Print
                </Button>

                {/* Email Vendor */}
                {po.vendor_email && (
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="flex-1 min-w-[96px]"
                  >
                    <a href={`mailto:${po.vendor_email}?subject=Purchase Order ${po.po_number || po.poNumber}`}>
                      <Mail className="mr-2 size-4" />
                      Email
                    </a>
                  </Button>
                )}

                {/* Status Update Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("pending_approval");
                        setStatusUpdateDialogOpen(true);
                      }}
                    >
                      Request Approval
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("approved");
                        setStatusUpdateDialogOpen(true);
                      }}
                    >
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("ordered");
                        setStatusUpdateDialogOpen(true);
                      }}
                    >
                      Mark as Ordered
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("partially_received");
                        setStatusUpdateDialogOpen(true);
                      }}
                    >
                      Partially Received
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("received");
                        setStatusUpdateDialogOpen(true);
                      }}
                    >
                      Mark as Received
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedStatus("cancelled");
                        setStatusUpdateDialogOpen(true);
                      }}
                      className="text-destructive"
                    >
                      Cancel PO
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Side - Metadata Grid */}
            <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 [&>div]:flex-[0_1_auto]">
                {/* Created Date */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Created</span>
                  <div className="flex h-5 items-center gap-2 whitespace-nowrap [&>*]:text-ellipsis text-sm">
                    <User className="size-4 flex-none text-muted-foreground" />
                    <span className="text-sm -ml-px shrink truncate">
                      {requestedByUser?.name || requestedByUser?.email || "Unknown"}
                    </span>
                    <span className="text-muted-foreground text-xs tabular-nums flex-none">
                      {new Date(po.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div className="flex whitespace-nowrap [&>*]:text-ellipsis text-sm gap-1 h-5 items-center -ml-[3px]">
                    <span className="size-4 flex items-center justify-center">
                      <span className={`size-2.5 flex-none rounded-full ${
                        po.status === "received" ? "bg-green-600" :
                        po.status === "cancelled" ? "bg-destructive" :
                        "bg-yellow-600"
                      }`}></span>
                    </span>
                    <span className="text-sm">
                      {po.status?.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Draft"}
                    </span>
                    {po.priority && (
                      <Badge variant="outline" className="ml-1">
                        {po.priority}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expected Delivery */}
                {po.expected_delivery && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Expected Delivery</span>
                    <div className="flex h-5 items-center gap-2 whitespace-nowrap [&>*]:text-ellipsis text-sm tabular-nums">
                      <Clock className="size-4 flex-none text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {new Date(po.expected_delivery).toLocaleDateString()}
                      </span>
                      {po.actual_delivery && (
                        <span className="text-muted-foreground text-xs">
                          {new Date(po.actual_delivery).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <div className="flex h-5 items-center gap-2 whitespace-nowrap [&>*]:text-ellipsis text-sm">
                    <DollarSign className="size-4 flex-none text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format((po.total_amount || 0) / 100)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Section */}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Vendor</span>
                <div className="flex h-5 items-center gap-2 whitespace-nowrap [&>*]:text-ellipsis text-sm">
                  {!isEditingVendor && (
                    <>
                      <User className="size-4 flex-none text-muted-foreground" />
                      {po.vendor ? (
                        <>
                          <span className="text-sm font-medium">{po.vendor}</span>
                          <Button
                            onClick={() => setIsEditingVendor(true)}
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2"
                          >
                            <Pencil className="size-3 mr-1" />
                            Change
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => setIsEditingVendor(true)}
                          size="sm"
                          variant="outline"
                          className="h-6"
                        >
                          Assign Vendor
                        </Button>
                      )}
                    </>
                  )}
                  {isEditingVendor && (
                    <div className="flex items-center gap-2 w-full">
                      <VendorSelect
                        value={selectedVendorId}
                        onValueChange={(vendorId, vendor) => {
                          setSelectedVendorId(vendorId);
                          setSelectedVendor(vendor);
                        }}
                        placeholder="Select vendor..."
                        className="flex-1"
                      />
                      <Button
                        disabled={isUpdatingVendor || !selectedVendorId}
                        onClick={async () => {
                          if (!selectedVendorId) {
                            toast.error("Please select a vendor");
                            return;
                          }

                          setIsUpdatingVendor(true);
                          try {
                            const vendorName = selectedVendor?.display_name || selectedVendor?.name || po.vendor;
                            const vendorEmail = selectedVendor?.email || po.vendor_email;
                            const vendorPhone = selectedVendor?.phone || po.vendor_phone;

                            const result = await updatePurchaseOrderVendor(
                              po.id,
                              selectedVendorId,
                              vendorName,
                              vendorEmail,
                              vendorPhone
                            );

                            if (result.success) {
                              toast.success(`Vendor changed to ${vendorName}`);
                              setIsEditingVendor(false);
                              router.refresh();
                            } else {
                              throw new Error(result.error || "Failed to update vendor");
                            }
                          } catch (error) {
                            toast.error(error instanceof Error ? error.message : "Failed to update vendor");
                          } finally {
                            setIsUpdatingVendor(false);
                          }
                        }}
                        size="sm"
                        className="h-6"
                      >
                        {isUpdatingVendor ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditingVendor(false);
                          setSelectedVendorId(po.vendor_id);
                          setSelectedVendor(null);
                        }}
                        size="sm"
                        variant="ghost"
                        disabled={isUpdatingVendor}
                        className="h-6"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Reference */}
              {po.job_id && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Related Job</span>
                  <div className="flex h-5 items-center gap-2 whitespace-nowrap [&>*]:text-ellipsis text-sm">
                    <FileCheck className="size-4 flex-none text-muted-foreground" />
                    <span className="text-sm font-medium">Job #{po.job_id}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Collapsible Footer - Outside columns */}
          <div className="rounded-b" data-orientation="vertical">
            <div data-state={isDetailsOpen ? "open" : "closed"} data-orientation="vertical">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="ease flex h-12 w-full items-center justify-between border-0 border-t border-border bg-transparent px-4 transition-all duration-200 hover:bg-muted/50 cursor-pointer disabled:text-muted-foreground"
                data-radix-collection-item=""
              >
                <span className="flex items-center gap-2 w-full">
                  <ChevronRight
                    className={`ease-[ease] size-4 transition-transform duration-200 ${
                      isDetailsOpen ? "rotate-90" : ""
                    }`}
                  />
                  <span className="flex items-center gap-2 w-full">
                    <span className="text-sm font-medium">Purchase Order Details</span>
                  </span>
                </span>
              </button>
              <div
                data-state={isDetailsOpen ? "open" : "closed"}
                hidden={!isDetailsOpen}
                role="region"
                className="overflow-hidden will-change-[height] animate-in slide-in-from-top-2 duration-200 data-[state=closed]:animate-out data-[state=closed]:animate-content-close data-[state=open]:animate-content-open"
              >
                <div className="space-y-4 p-4 sm:p-6 border-t">
                  {/* PO Number */}
                  <div>
                    <Label className="text-xs text-muted-foreground">PO Number</Label>
                    <p className="font-medium text-sm mt-1">{po.po_number || po.poNumber}</p>
                  </div>

                  {/* Delivery Address */}
                  {po.delivery_address && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Delivery Address</Label>
                      <p className="text-sm mt-1 whitespace-pre-line">{po.delivery_address}</p>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {po.tracking_number && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Tracking Number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-sm">{po.tracking_number}</p>
                        <Button
                          asChild
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                        >
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(po.tracking_number)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Track
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {po.notes && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Public Notes</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap">{po.notes}</p>
                    </div>
                  )}

                  {/* Internal Notes */}
                  {po.internal_notes && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Internal Notes</Label>
                      <p className="text-sm mt-1 whitespace-pre-wrap text-muted-foreground">{po.internal_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Accordion Section */}
        <UnifiedAccordion sections={accordionSections} defaultOpenSection="line-items" />
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog onOpenChange={setStatusUpdateDialogOpen} open={statusUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Purchase Order Status</DialogTitle>
            <DialogDescription>
              Update the status of this purchase order to {selectedStatus.replace("_", " ")}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>New Status</Label>
              <div className="mt-2">
                <Badge variant="default">
                  {selectedStatus.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                </Badge>
              </div>
            </div>
            <div>
              <Label htmlFor="status-notes">Notes (Optional)</Label>
              <Textarea
                id="status-notes"
                placeholder="Add any notes about this status change..."
                value={statusUpdateNotes}
                onChange={(e) => setStatusUpdateNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              onClick={() => {
                setStatusUpdateDialogOpen(false);
                setStatusUpdateNotes("");
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                // TODO: Implement status update logic
                toast.success(`Status changed to ${selectedStatus.replace("_", " ")}`);
                setStatusUpdateDialogOpen(false);
                setStatusUpdateNotes("");
              }}
              disabled={isUpdatingStatus}
              className="w-full sm:w-auto"
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
