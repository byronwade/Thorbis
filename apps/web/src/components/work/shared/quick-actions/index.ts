/**
 * Quick Actions - Shared components for inline actions on detail pages
 *
 * These components enable users to take immediate action without navigating away:
 * - Status updates with dropdown
 * - Send email/SMS communications
 * - Record payments
 * - Add quick notes
 */

// Status Updates
export {
	StatusUpdateDropdown,
	StatusBadge,
	type StatusEntityType,
	type StatusOption,
} from "./status-update-dropdown";

// Communication
export {
	SendMessageDialog,
	QuickEmailButton,
	QuickSmsButton,
	type MessageEntityContext,
	type RecipientInfo,
	type EmailTemplate,
} from "./send-message-dialog";

// Payments
export {
	RecordPaymentDialog,
	PaymentSummaryBadge,
	type PaymentMethod,
	type PaymentData,
} from "./record-payment-dialog";

// Notes
export {
	QuickNoteInput,
	QuickNoteButton,
} from "./quick-note-input";
