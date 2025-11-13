/**
 * Detail Page Toolbar Presets
 *
 * Pre-configured toolbar setups for each entity type.
 * These presets ensure consistency across all detail pages while
 * allowing customization for entity-specific needs.
 *
 * Usage:
 * ```typescript
 * import { getJobDetailToolbar } from "@/components/layout/detail-page-toolbar-presets";
 *
 * const toolbarConfig = getJobDetailToolbar({
 *   jobId: "123",
 *   jobNumber: "J-2024-001",
 *   status: "in-progress",
 *   onArchive: handleArchive,
 * });
 *
 * <DetailPageToolbar {...toolbarConfig} />
 * ```
 */

import {
  Archive,
  BarChart3,
  Briefcase,
  Calendar,
  ClipboardList,
  Copy,
  DollarSign,
  Download,
  Edit3,
  Eye,
  FileText,
  KeyRound,
  Mail,
  MapPin,
  Package,
  Printer,
  Receipt,
  Send,
  Share2,
  Trash2,
  User,
  UserCheck,
  UserX,
  Wrench,
} from "lucide-react";
import type { DetailToolbarProps } from "./detail-page-toolbar";

// ============================================================================
// JOB DETAIL TOOLBAR
// ============================================================================

export type JobDetailToolbarConfig = {
  jobId: string;
  jobNumber: string;
  jobTitle?: string;
  status: string;
  onArchive: () => void;
  onClone: () => void;
  onViewStatistics: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  onDelete?: () => void;
};

export function getJobDetailToolbar(
  config: JobDetailToolbarConfig
): DetailToolbarProps {
  // Map job status to badge variant
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    scheduled: "default",
    "in-progress": "warning",
    completed: "success",
    cancelled: "destructive",
    "on-hold": "warning",
  };

  return {
    back: {
      href: "/dashboard/work",
      label: "Back to Jobs",
    },
    title: config.jobNumber,
    subtitle: config.jobTitle,
    status: {
      label: config.status
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      {
        id: "statistics",
        label: "Statistics",
        icon: BarChart3,
        onClick: config.onViewStatistics,
        variant: "primary",
        tooltip: "View job analytics and metrics",
      },
    ],
    secondaryActions: [
      {
        id: "invoice",
        label: "Invoice",
        icon: Receipt,
        href: `/dashboard/work/invoices/new?jobId=${config.jobId}`,
        tooltip: "Create invoice from this job",
      },
      {
        id: "estimate",
        label: "Estimate",
        icon: FileText,
        href: `/dashboard/work/estimates/new?jobId=${config.jobId}`,
        tooltip: "Create estimate from this job",
      },
      {
        id: "clone",
        label: "Clone",
        icon: Copy,
        onClick: config.onClone,
        tooltip: "Duplicate this job",
      },
    ],
    contextActions: [
      {
        id: "export",
        label: "Export to CSV",
        icon: Download,
        onClick: config.onExport || (() => {}),
      },
      {
        id: "print",
        label: "Print Job Details",
        icon: Printer,
        onClick: config.onPrint || (() => {}),
      },
      {
        id: "share",
        label: "Share Job Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Job",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
      ...(config.onDelete
        ? [
            {
              id: "delete",
              label: "Delete Job",
              icon: Trash2,
              onClick: config.onDelete,
              variant: "destructive" as const,
            },
          ]
        : []),
    ],
  };
}

// ============================================================================
// CUSTOMER DETAIL TOOLBAR
// ============================================================================

export type CustomerDetailToolbarConfig = {
  customerId: string;
  customerName: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onArchive: () => void;
  onExport?: () => void;
  onDelete?: () => void;
};

export function getCustomerDetailToolbar(
  config: CustomerDetailToolbarConfig
): DetailToolbarProps {
  return {
    back: {
      href: "/dashboard/customers",
      label: "Back to Customers",
    },
    title: config.customerName,
    subtitle: "Customer",
    primaryActions: [
      {
        id: "edit-mode",
        label: config.isEditMode ? "View" : "Edit",
        icon: config.isEditMode ? Eye : Edit3,
        onClick: config.onToggleEditMode,
        variant: config.isEditMode ? "primary" : "default",
        tooltip: config.isEditMode
          ? "Switch to view mode"
          : "Switch to edit mode",
      },
    ],
    secondaryActions: config.isEditMode
      ? []
      : [
          {
            id: "new-job",
            label: "Job",
            icon: Briefcase,
            href: `/dashboard/work/new?customerId=${config.customerId}`,
            tooltip: "Create new job for this customer",
          },
          {
            id: "new-invoice",
            label: "Invoice",
            icon: Receipt,
            href: `/dashboard/work/invoices/new?customerId=${config.customerId}`,
            tooltip: "Create new invoice",
          },
          {
            id: "new-estimate",
            label: "Estimate",
            icon: FileText,
            href: `/dashboard/work/estimates/new?customerId=${config.customerId}`,
            tooltip: "Create new estimate",
          },
        ],
    contextActions: [
      {
        id: "email",
        label: "Send Email",
        icon: Mail,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Customer Data",
        icon: Download,
        onClick: config.onExport || (() => {}),
      },
      {
        id: "archive",
        label: "Archive Customer",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
      ...(config.onDelete
        ? [
            {
              id: "delete",
              label: "Delete Customer",
              icon: Trash2,
              onClick: config.onDelete,
              variant: "destructive" as const,
            },
          ]
        : []),
    ],
  };
}

// ============================================================================
// ESTIMATE DETAIL TOOLBAR
// ============================================================================

export type EstimateDetailToolbarConfig = {
  estimateId: string;
  estimateNumber: string;
  status: string;
  onSend: () => void;
  onConvertToInvoice: () => void;
  onArchive: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
};

export function getEstimateDetailToolbar(
  config: EstimateDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    sent: "default",
    viewed: "warning",
    accepted: "success",
    declined: "destructive",
    expired: "destructive",
  };

  const canSend = config.status === "draft" || config.status === "viewed";
  const canConvert = config.status === "accepted";

  return {
    back: {
      href: "/dashboard/work/estimates",
      label: "Back to Estimates",
    },
    title: config.estimateNumber,
    subtitle: "Estimate",
    status: {
      label: config.status.charAt(0).toUpperCase() + config.status.slice(1),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      ...(canSend
        ? [
            {
              id: "send",
              label: "Send",
              icon: Send,
              onClick: config.onSend,
              variant: "primary" as const,
              tooltip: "Send estimate to customer",
            },
          ]
        : []),
      ...(canConvert
        ? [
            {
              id: "convert",
              label: "Convert to Invoice",
              icon: Receipt,
              onClick: config.onConvertToInvoice,
              variant: "success" as const,
              tooltip: "Create invoice from this estimate",
            },
          ]
        : []),
    ],
    secondaryActions: [
      {
        id: "download",
        label: "PDF",
        icon: Download,
        onClick: config.onDownloadPDF || (() => {}),
        tooltip: "Download PDF",
      },
      {
        id: "print",
        label: "Print",
        icon: Printer,
        onClick: config.onPrint || (() => {}),
        tooltip: "Print estimate",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate Estimate",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "share",
        label: "Share Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Estimate",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// INVOICE DETAIL TOOLBAR
// ============================================================================

export type InvoiceDetailToolbarConfig = {
  invoiceId: string;
  invoiceNumber: string;
  status: string;
  onSend: () => void;
  onRecordPayment: () => void;
  onArchive: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
};

export function getInvoiceDetailToolbar(
  config: InvoiceDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    sent: "default",
    viewed: "warning",
    "partially-paid": "warning",
    paid: "success",
    overdue: "destructive",
    void: "destructive",
  };

  const canSend = ["draft", "sent", "viewed"].includes(config.status);
  const canRecordPayment = !["paid", "void"].includes(config.status);

  return {
    back: {
      href: "/dashboard/work/invoices",
      label: "Back to Invoices",
    },
    title: config.invoiceNumber,
    subtitle: "Invoice",
    status: {
      label: config.status
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      ...(canSend
        ? [
            {
              id: "send",
              label: "Send",
              icon: Send,
              onClick: config.onSend,
              variant: "primary" as const,
              tooltip: "Send invoice to customer",
            },
          ]
        : []),
      ...(canRecordPayment
        ? [
            {
              id: "record-payment",
              label: "Record Payment",
              icon: DollarSign,
              onClick: config.onRecordPayment,
              variant: "success" as const,
              tooltip: "Record a payment for this invoice",
            },
          ]
        : []),
    ],
    secondaryActions: [
      {
        id: "download",
        label: "PDF",
        icon: Download,
        onClick: config.onDownloadPDF || (() => {}),
        tooltip: "Download PDF",
      },
      {
        id: "print",
        label: "Print",
        icon: Printer,
        onClick: config.onPrint || (() => {}),
        tooltip: "Print invoice",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate Invoice",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "share",
        label: "Share Payment Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Invoice",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// PROPERTY DETAIL TOOLBAR
// ============================================================================

export type PropertyDetailToolbarConfig = {
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  onArchive: () => void;
  onExport?: () => void;
};

export function getPropertyDetailToolbar(
  config: PropertyDetailToolbarConfig
): DetailToolbarProps {
  return {
    back: {
      href: "/dashboard/work/properties",
      label: "Back to Properties",
    },
    title: config.propertyName,
    subtitle: config.propertyAddress,
    primaryActions: [
      {
        id: "new-job",
        label: "New Job",
        icon: Briefcase,
        href: `/dashboard/work/new?propertyId=${config.propertyId}`,
        variant: "primary",
        tooltip: "Create new job for this property",
      },
    ],
    secondaryActions: [
      {
        id: "schedule",
        label: "Schedule",
        icon: Calendar,
        href: `/dashboard/schedule?propertyId=${config.propertyId}`,
        tooltip: "View property schedule",
      },
      {
        id: "equipment",
        label: "Equipment",
        icon: Wrench,
        href: `/dashboard/work/properties/${config.propertyId}?tab=equipment`,
        tooltip: "View installed equipment",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "view-map",
        label: "View on Map",
        icon: MapPin,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Property Data",
        icon: Download,
        onClick: config.onExport || (() => {}),
      },
      {
        id: "archive",
        label: "Archive Property",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// TEAM MEMBER DETAIL TOOLBAR
// ============================================================================

export type TeamMemberDetailToolbarConfig = {
  memberId: string;
  memberName: string;
  status: string;
  canManage: boolean;
  onActivate: () => void;
  onSuspend: () => void;
  onArchive: () => void;
  onSendPasswordReset?: () => void;
  onExport?: () => void;
};

export function getTeamMemberDetailToolbar(
  config: TeamMemberDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    active: "success",
    invited: "warning",
    suspended: "destructive",
  };

  const isActive = config.status === "active";

  return {
    back: {
      href: "/dashboard/work/team",
      label: "Back to Team",
    },
    title: config.memberName,
    subtitle: "Team Member",
    status: {
      label: config.status.charAt(0).toUpperCase() + config.status.slice(1),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: isActive
      ? []
      : [
          {
            id: "activate",
            label: "Activate",
            icon: UserCheck,
            onClick: config.onActivate,
            variant: "success",
            tooltip: "Activate team member",
          },
        ],
    secondaryActions: [
      {
        id: "send-email",
        label: "Email",
        icon: Mail,
        onClick: () => {},
        tooltip: "Send email to team member",
      },
      {
        id: "view-schedule",
        label: "Schedule",
        icon: Calendar,
        href: `/dashboard/schedule?teamMemberId=${config.memberId}`,
        tooltip: "View member schedule",
        desktopOnly: true,
      },
    ],
    contextActions: [
      ...(config.canManage && config.onSendPasswordReset
        ? [
            {
              id: "password-reset",
              label: "Send Password Reset",
              icon: KeyRound,
              onClick: config.onSendPasswordReset,
            },
            {
              id: "separator-1",
              label: "",
              icon: User,
              onClick: () => {},
              separatorBefore: true,
            },
          ]
        : []),
      {
        id: "suspend",
        label: "Suspend Member",
        icon: UserX,
        onClick: config.onSuspend,
        variant: "destructive",
      },
      ...(config.canManage
        ? [
            {
              id: "archive",
              label: "Archive Member",
              icon: Archive,
              onClick: config.onArchive,
              variant: "destructive" as const,
              separatorBefore: true,
            },
          ]
        : []),
    ],
  };
}

// ============================================================================
// EQUIPMENT DETAIL TOOLBAR
// ============================================================================

export type EquipmentDetailToolbarConfig = {
  equipmentId: string;
  equipmentNumber: string;
  equipmentName: string;
  onArchive: () => void;
  onExport?: () => void;
};

export function getEquipmentDetailToolbar(
  config: EquipmentDetailToolbarConfig
): DetailToolbarProps {
  return {
    back: {
      href: "/dashboard/work/equipment",
      label: "Back to Equipment",
    },
    title: config.equipmentNumber,
    subtitle: config.equipmentName,
    primaryActions: [
      {
        id: "create-job",
        label: "Create Service Job",
        icon: Wrench,
        href: `/dashboard/work/new?equipmentId=${config.equipmentId}`,
        variant: "primary",
        tooltip: "Create service job for this equipment",
      },
    ],
    secondaryActions: [
      {
        id: "maintenance",
        label: "Maintenance Log",
        icon: ClipboardList,
        href: `/dashboard/work/equipment/${config.equipmentId}?tab=maintenance`,
        tooltip: "View maintenance history",
      },
      {
        id: "parts",
        label: "Parts",
        icon: Package,
        href: `/dashboard/work/equipment/${config.equipmentId}?tab=parts`,
        tooltip: "View replacement parts",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "qr-code",
        label: "Generate QR Code",
        icon: Download,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Equipment Data",
        icon: Download,
        onClick: config.onExport || (() => {}),
      },
      {
        id: "archive",
        label: "Archive Equipment",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// CONTRACT DETAIL TOOLBAR
// ============================================================================

export type ContractDetailToolbarConfig = {
  contractId: string;
  contractNumber: string;
  status: string;
  onSend: () => void;
  onArchive: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
};

export function getContractDetailToolbar(
  config: ContractDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    active: "success",
    pending: "warning",
    expired: "destructive",
    terminated: "destructive",
  };

  const canSend = config.status === "draft";

  return {
    back: {
      href: "/dashboard/work/contracts",
      label: "Back to Contracts",
    },
    title: config.contractNumber,
    subtitle: "Contract",
    status: {
      label: config.status.charAt(0).toUpperCase() + config.status.slice(1),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: canSend
      ? [
          {
            id: "send",
            label: "Send for Signature",
            icon: Send,
            onClick: config.onSend,
            variant: "primary",
            tooltip: "Send contract for customer signature",
          },
        ]
      : [],
    secondaryActions: [
      {
        id: "download",
        label: "PDF",
        icon: Download,
        onClick: config.onDownloadPDF || (() => {}),
        tooltip: "Download PDF",
      },
      {
        id: "print",
        label: "Print",
        icon: Printer,
        onClick: config.onPrint || (() => {}),
        tooltip: "Print contract",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate Contract",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "share",
        label: "Share Signing Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Contract",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// PURCHASE ORDER DETAIL TOOLBAR
// ============================================================================

export type PurchaseOrderDetailToolbarConfig = {
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  status: string;
  onSend: () => void;
  onReceive: () => void;
  onArchive: () => void;
  onDownloadPDF?: () => void;
  onPrint?: () => void;
};

export function getPurchaseOrderDetailToolbar(
  config: PurchaseOrderDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    sent: "default",
    "partially-received": "warning",
    received: "success",
    cancelled: "destructive",
  };

  const canSend = ["draft", "sent"].includes(config.status);
  const canReceive = ["sent", "partially-received"].includes(config.status);

  return {
    back: {
      href: "/dashboard/work/purchase-orders",
      label: "Back to Purchase Orders",
    },
    title: config.purchaseOrderNumber,
    subtitle: "Purchase Order",
    status: {
      label: config.status
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      ...(canSend
        ? [
            {
              id: "send",
              label: "Send",
              icon: Send,
              onClick: config.onSend,
              variant: "primary" as const,
              tooltip: "Send PO to vendor",
            },
          ]
        : []),
      ...(canReceive
        ? [
            {
              id: "receive",
              label: "Receive Items",
              icon: Package,
              onClick: config.onReceive,
              variant: "success" as const,
              tooltip: "Mark items as received",
            },
          ]
        : []),
    ],
    secondaryActions: [
      {
        id: "download",
        label: "PDF",
        icon: Download,
        onClick: config.onDownloadPDF || (() => {}),
        tooltip: "Download PDF",
      },
      {
        id: "print",
        label: "Print",
        icon: Printer,
        onClick: config.onPrint || (() => {}),
        tooltip: "Print purchase order",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate PO",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Items",
        icon: Download,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive PO",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// APPOINTMENT DETAIL TOOLBAR
// ============================================================================

export type AppointmentDetailToolbarConfig = {
  appointmentId: string;
  appointmentTitle: string;
  status: string;
  onReschedule: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onConvertToJob?: () => void;
};

export function getAppointmentDetailToolbar(
  config: AppointmentDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    scheduled: "default",
    confirmed: "success",
    "in-progress": "warning",
    completed: "success",
    cancelled: "destructive",
    "no-show": "destructive",
  };

  const canComplete = ["scheduled", "confirmed", "in-progress"].includes(
    config.status
  );
  const canConvert = config.status === "completed" && config.onConvertToJob;

  return {
    back: {
      href: "/dashboard/work/appointments",
      label: "Back to Appointments",
    },
    title: config.appointmentTitle,
    subtitle: "Appointment",
    status: {
      label: config.status
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      ...(canComplete
        ? [
            {
              id: "complete",
              label: "Complete",
              icon: UserCheck,
              onClick: config.onComplete,
              variant: "success" as const,
              tooltip: "Mark appointment as completed",
            },
          ]
        : []),
      ...(canConvert
        ? [
            {
              id: "convert",
              label: "Convert to Job",
              icon: Briefcase,
              onClick: config.onConvertToJob!,
              variant: "primary" as const,
              tooltip: "Create job from this appointment",
            },
          ]
        : []),
    ],
    secondaryActions: [
      {
        id: "reschedule",
        label: "Reschedule",
        icon: Calendar,
        onClick: config.onReschedule,
        tooltip: "Reschedule appointment",
      },
    ],
    contextActions: [
      {
        id: "send-reminder",
        label: "Send Reminder",
        icon: Mail,
        onClick: () => {},
      },
      {
        id: "duplicate",
        label: "Duplicate Appointment",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "cancel",
        label: "Cancel Appointment",
        icon: Archive,
        onClick: config.onCancel,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// PAYMENT DETAIL TOOLBAR
// ============================================================================

export type PaymentDetailToolbarConfig = {
  paymentId: string;
  paymentNumber: string;
  status: string;
  onRefund?: () => void;
  onArchive: () => void;
  onDownloadReceipt?: () => void;
};

export function getPaymentDetailToolbar(
  config: PaymentDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    pending: "warning",
    processing: "warning",
    succeeded: "success",
    failed: "destructive",
    refunded: "destructive",
    "partially-refunded": "warning",
  };

  const canRefund =
    ["succeeded", "partially-refunded"].includes(config.status) &&
    config.onRefund;

  return {
    back: {
      href: "/dashboard/work/payments",
      label: "Back to Payments",
    },
    title: config.paymentNumber,
    subtitle: "Payment",
    status: {
      label: config.status
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: canRefund
      ? [
          {
            id: "refund",
            label: "Issue Refund",
            icon: DollarSign,
            onClick: config.onRefund!,
            variant: "destructive",
            tooltip: "Issue refund for this payment",
          },
        ]
      : [],
    secondaryActions: [
      {
        id: "receipt",
        label: "Receipt",
        icon: Receipt,
        onClick: config.onDownloadReceipt || (() => {}),
        tooltip: "Download receipt",
      },
      {
        id: "print",
        label: "Print",
        icon: Printer,
        onClick: () => {},
        tooltip: "Print payment details",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "email-receipt",
        label: "Email Receipt",
        icon: Mail,
        onClick: () => {},
      },
      {
        id: "share",
        label: "Share Receipt Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Payment",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// MAINTENANCE PLAN DETAIL TOOLBAR
// ============================================================================

export type MaintenancePlanDetailToolbarConfig = {
  planId: string;
  planName: string;
  status: string;
  onActivate?: () => void;
  onPause?: () => void;
  onArchive: () => void;
};

export function getMaintenancePlanDetailToolbar(
  config: MaintenancePlanDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    active: "success",
    paused: "warning",
    cancelled: "destructive",
  };

  const canActivate = config.status === "draft" && config.onActivate;
  const canPause = config.status === "active" && config.onPause;

  return {
    back: {
      href: "/dashboard/work/maintenance-plans",
      label: "Back to Maintenance Plans",
    },
    title: config.planName,
    subtitle: "Maintenance Plan",
    status: {
      label: config.status.charAt(0).toUpperCase() + config.status.slice(1),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: [
      ...(canActivate
        ? [
            {
              id: "activate",
              label: "Activate Plan",
              icon: UserCheck,
              onClick: config.onActivate!,
              variant: "success" as const,
              tooltip: "Activate maintenance plan",
            },
          ]
        : []),
      ...(canPause
        ? [
            {
              id: "pause",
              label: "Pause Plan",
              icon: Calendar,
              onClick: config.onPause!,
              variant: "default" as const,
              tooltip: "Pause maintenance plan",
            },
          ]
        : []),
    ],
    secondaryActions: [
      {
        id: "schedule",
        label: "Schedule",
        icon: Calendar,
        href: `/dashboard/schedule?planId=${config.planId}`,
        tooltip: "View plan schedule",
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate Plan",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "export",
        label: "Export Plan Data",
        icon: Download,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Plan",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}

// ============================================================================
// SERVICE AGREEMENT DETAIL TOOLBAR
// ============================================================================

export type ServiceAgreementDetailToolbarConfig = {
  agreementId: string;
  agreementNumber: string;
  status: string;
  onRenew?: () => void;
  onArchive: () => void;
  onDownloadPDF?: () => void;
};

export function getServiceAgreementDetailToolbar(
  config: ServiceAgreementDetailToolbarConfig
): DetailToolbarProps {
  const statusVariantMap: Record<string, any> = {
    draft: "secondary",
    active: "success",
    expiring: "warning",
    expired: "destructive",
    cancelled: "destructive",
  };

  const canRenew = config.status === "expiring" && config.onRenew;

  return {
    back: {
      href: "/dashboard/work/service-agreements",
      label: "Back to Service Agreements",
    },
    title: config.agreementNumber,
    subtitle: "Service Agreement",
    status: {
      label: config.status.charAt(0).toUpperCase() + config.status.slice(1),
      variant: statusVariantMap[config.status] || "default",
    },
    primaryActions: canRenew
      ? [
          {
            id: "renew",
            label: "Renew Agreement",
            icon: FileText,
            onClick: config.onRenew!,
            variant: "primary",
            tooltip: "Renew service agreement",
          },
        ]
      : [],
    secondaryActions: [
      {
        id: "download",
        label: "PDF",
        icon: Download,
        onClick: config.onDownloadPDF || (() => {}),
        tooltip: "Download PDF",
      },
      {
        id: "schedule",
        label: "Schedule",
        icon: Calendar,
        href: `/dashboard/schedule?agreementId=${config.agreementId}`,
        tooltip: "View agreement schedule",
        desktopOnly: true,
      },
    ],
    contextActions: [
      {
        id: "duplicate",
        label: "Duplicate Agreement",
        icon: Copy,
        onClick: () => {},
      },
      {
        id: "share",
        label: "Share Link",
        icon: Share2,
        onClick: () => {},
      },
      {
        id: "archive",
        label: "Archive Agreement",
        icon: Archive,
        onClick: config.onArchive,
        variant: "destructive",
        separatorBefore: true,
      },
    ],
  };
}
