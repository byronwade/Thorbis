/**
 * Generate Test Data: 1,000 Invoices with Linked Payments
 *
 * This script generates:
 * - 1,000 invoices with random amounts
 * - 5-10 payments per invoice (random)
 * - All payments properly linked to their invoices
 * - Invoice amounts updated to reflect payments
 *
 * Usage:
 * ```bash
 * tsx scripts/generate-invoices-payments.ts
 * ```
 *
 * CAUTION: This will insert 1,000+ records into your database!
 */

import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

// ============================================================================
// Configuration
// ============================================================================

const TOTAL_INVOICES = 1000;
const MIN_PAYMENTS_PER_INVOICE = 5;
const MAX_PAYMENTS_PER_INVOICE = 10;
const MIN_INVOICE_AMOUNT = 50_000; // $500 in cents
const MAX_INVOICE_AMOUNT = 1_000_000; // $10,000 in cents
const CUSTOMER_FETCH_LIMIT = 100;
const SALES_TAX_RATE = 0.08;
const SALES_TAX_DIVISOR = 1 + SALES_TAX_RATE;
const PROCESSOR_PERCENT_FEE = 0.029;
const PROCESSOR_FIXED_FEE_CENTS = 30;
const NET_TERMS_DAYS = 30;
const CENTS_IN_DOLLAR = 100;
const PERCENT_FACTOR = 100;
const SALES_TAX_RATE_PERCENT = SALES_TAX_RATE * PERCENT_FACTOR;
const CARD_DETAIL_PROBABILITY = 0.5;
const CARD_LAST4_MIN = 1000;
const CARD_LAST4_MAX = 9999;
const STATUS_PERCENT_DECIMALS = 1;
const SEQUENCE_PAD_LENGTH = 4;
const PARTIAL_MIN_PERCENT = 0.5;
const PARTIAL_RANGE_PERCENT = 0.4;
const MIN_PAYMENT_PERCENT = 0.1;
const MAX_PAYMENT_PERCENT = 0.4;
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MILLISECONDS_PER_SECOND = 1000;
const MILLISECONDS_PER_DAY =
	HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;
const NET_TERMS_MS = NET_TERMS_DAYS * MILLISECONDS_PER_DAY;
const SENT_DATE_DAYS = 60;
const VIEWED_DATE_DAYS = 50;
const PAID_DATE_DAYS = 30;
const CREATED_DATE_DAYS = 90;
const PAYMENT_PROCESSED_DAYS = 30;
const PAYMENT_COMPLETED_DAYS = 25;
const PAYMENT_CREATED_DAYS = 35;
const PROGRESS_INTERVAL = 100;

// Payment methods to randomly choose from
const PAYMENT_METHODS = [
	"cash",
	"check",
	"credit_card",
	"debit_card",
	"ach",
	"wire",
	"venmo",
	"paypal",
] as const;

const PAYMENT_STATUSES = [
	"completed",
	"completed",
	"completed",
	"completed",
	"processing",
	"pending",
] as const; // Weight towards completed

const INVOICE_STATUSES = ["paid", "partial", "sent"] as const;

type SupabaseClientType = ReturnType<typeof createClient>;
type CompanyRecord = { id: string };
type CustomerRecord = { id: string };

type InvoiceInsert = {
	id: string;
	company_id: string;
	customer_id: string;
	invoice_number: string;
	title: string;
	description: string;
	status: "paid" | "partial" | "sent";
	subtotal: number;
	tax_rate: number;
	tax_amount: number;
	discount_amount: number;
	total_amount: number;
	amount_paid: number;
	amount_due: number;
	balance_amount: number;
	paid_amount: number;
	due_date: string;
	payment_terms: string;
	line_items: Array<{
		description: string;
		quantity: number;
		unit_price: number;
		amount: number;
	}>;
	sent_at: string;
	viewed_at: string;
	paid_at: string | null;
	created_at: string;
};

type PaymentInsert = {
	id: string;
	company_id: string;
	customer_id: string;
	invoice_id: string;
	payment_number: string;
	reference_number: string;
	amount: number;
	payment_method: (typeof PAYMENT_METHODS)[number];
	payment_type: "payment";
	status: (typeof PAYMENT_STATUSES)[number];
	card_brand: "visa" | "mastercard" | "amex" | "discover" | null;
	card_last4: string | null;
	processor_name: string;
	processor_transaction_id: string;
	processor_fee: number;
	net_amount: number;
	receipt_number: string;
	receipt_emailed: boolean;
	processed_at: string;
	completed_at: string;
	created_at: string;
};

// ============================================================================
// Utility Functions
// ============================================================================

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: readonly T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function generateInvoiceNumber(index: number): string {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const sequence = String(index).padStart(SEQUENCE_PAD_LENGTH, "0");
	return `INV-${year}${month}-${sequence}`;
}

function generatePaymentNumber(invoiceIndex: number, paymentIndex: number): string {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const invoiceSequence = String(invoiceIndex).padStart(SEQUENCE_PAD_LENGTH, "0");
	return `PAY-${year}${month}-${invoiceSequence}-${paymentIndex}`;
}

/**
 * Split an amount into random chunks for payments
 * Ensures payments add up to total (or slightly less for partial payments)
 */
function splitAmountIntoPayments(
	totalAmount: number,
	numPayments: number,
	isPartialPaid = false
): number[] {
	const targetAmount = isPartialPaid
		? Math.floor(totalAmount * (PARTIAL_MIN_PERCENT + Math.random() * PARTIAL_RANGE_PERCENT)) // 50-90% paid
		: totalAmount;

	const payments: number[] = [];
	let remaining = targetAmount;

	for (let i = 0; i < numPayments - 1; i++) {
		// Random payment between 10% and 40% of remaining
		const minPayment = Math.floor(remaining * MIN_PAYMENT_PERCENT);
		const maxPayment = Math.floor(remaining * MAX_PAYMENT_PERCENT);
		const payment = randomInt(minPayment, maxPayment);
		payments.push(payment);
		remaining -= payment;
	}

	// Last payment gets the remainder
	if (remaining > 0) {
		payments.push(remaining);
	}

	return payments;
}

/**
 * Generate random date within last 90 days
 */
function randomRecentDate(daysBack = 90): Date {
	const now = Date.now();
	const daysInMs = daysBack * MILLISECONDS_PER_DAY;
	const randomTime = now - Math.random() * daysInMs;
	return new Date(randomTime);
}

// ============================================================================
// Main Script
// ============================================================================

async function generateInvoicesAndPayments() {
	console.log("🚀 Starting invoice and payment generation...\n");

	const supabase = initializeSupabaseClient();
	const companyId = await fetchCompanyId(supabase);
	const customers = await fetchCustomers(supabase);
	const { invoices, payments } = buildInvoicesAndPayments(companyId, customers);

	await insertInvoices(supabase, invoices);
	await insertPayments(supabase, payments);
	logSummary(invoices, payments);
}

function initializeSupabaseClient(): SupabaseClientType {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const supabaseKey =
		process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!(supabaseUrl && supabaseKey)) {
		console.error("\n❌ Missing Supabase credentials!");
		console.error("\nPlease ensure your .env.local file contains:");
		console.error("  NEXT_PUBLIC_SUPABASE_URL=your-url");
		console.error("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key");
		console.error("  (or SUPABASE_SERVICE_ROLE_KEY for admin access)\n");
		throw new Error("Missing Supabase credentials in environment variables");
	}

	return createClient(supabaseUrl, supabaseKey);
}

async function fetchCompanyId(supabase: SupabaseClientType): Promise<string> {
	console.log("📋 Fetching company data...");

	const { data, error } = await supabase
		.from<CompanyRecord>("companies")
		.select("id")
		.limit(1)
		.single();

	if (error || !data) {
		throw new Error(`Failed to fetch company: ${error?.message}`);
	}

	console.log(`✅ Using company: ${data.id}`);
	return data.id;
}

async function fetchCustomers(supabase: SupabaseClientType): Promise<CustomerRecord[]> {
	const { data, error } = await supabase
		.from<CustomerRecord>("customers")
		.select("id")
		.limit(CUSTOMER_FETCH_LIMIT);

	if (error || !data || data.length === 0) {
		throw new Error(`Failed to fetch customers: ${error?.message}`);
	}

	console.log(`✅ Found ${data.length} customers\n`);
	return data;
}

function buildInvoicesAndPayments(companyId: string, customers: CustomerRecord[]) {
	console.log(`📝 Generating ${TOTAL_INVOICES} invoices...`);

	const invoices: InvoiceInsert[] = [];
	const payments: PaymentInsert[] = [];

	for (let i = 1; i <= TOTAL_INVOICES; i++) {
		const invoiceData = createInvoiceData(i, companyId, customers);
		invoices.push(invoiceData.invoice);
		payments.push(...invoiceData.payments);

		if (i % PROGRESS_INTERVAL === 0) {
			console.log(`   Generated ${i}/${TOTAL_INVOICES} invoices...`);
		}
	}

	console.log(`✅ Generated ${invoices.length} invoices`);
	console.log(`✅ Generated ${payments.length} payments\n`);

	return { invoices, payments };
}

function createInvoiceData(index: number, companyId: string, customers: CustomerRecord[]) {
	const totalAmount = randomInt(MIN_INVOICE_AMOUNT, MAX_INVOICE_AMOUNT);
	const subtotal = Math.floor(totalAmount / SALES_TAX_DIVISOR);
	const taxAmount = totalAmount - subtotal;
	const numPayments = randomInt(MIN_PAYMENTS_PER_INVOICE, MAX_PAYMENTS_PER_INVOICE);
	const invoiceStatus = randomElement(INVOICE_STATUSES);
	const isPartialPaid = invoiceStatus === "partial";
	const isSent = invoiceStatus === "sent";
	const paymentAmounts = isSent
		? []
		: splitAmountIntoPayments(totalAmount, numPayments, isPartialPaid);
	const amountPaid = paymentAmounts.reduce((sum, amt) => sum + amt, 0);
	const amountDue = totalAmount - amountPaid;
	const status = determineInvoiceStatus(amountDue, totalAmount);

	const invoice: InvoiceInsert = {
		id: crypto.randomUUID(),
		company_id: companyId,
		customer_id: randomElement(customers).id,
		invoice_number: generateInvoiceNumber(index),
		title: `Service Invoice #${index}`,
		description: `Professional services rendered for project ${index}`,
		status,
		subtotal,
		tax_rate: SALES_TAX_RATE_PERCENT,
		tax_amount: taxAmount,
		discount_amount: 0,
		total_amount: totalAmount,
		amount_paid: amountPaid,
		amount_due: amountDue,
		balance_amount: amountDue,
		paid_amount: amountPaid,
		due_date: new Date(Date.now() + NET_TERMS_MS).toISOString(),
		payment_terms: "Net 30",
		line_items: [
			{
				description: "Professional Services",
				quantity: 1,
				unit_price: subtotal,
				amount: subtotal,
			},
		],
		sent_at: randomRecentDate(SENT_DATE_DAYS).toISOString(),
		viewed_at: randomRecentDate(VIEWED_DATE_DAYS).toISOString(),
		paid_at: amountDue === 0 ? randomRecentDate(PAID_DATE_DAYS).toISOString() : null,
		created_at: randomRecentDate(CREATED_DATE_DAYS).toISOString(),
	};

	const payments = createPaymentData(index, invoice, paymentAmounts, companyId);

	return { invoice, payments };
}

function determineInvoiceStatus(amountDue: number, totalAmount: number) {
	if (amountDue === 0) {
		return "paid" as const;
	}
	if (amountDue === totalAmount) {
		return "sent" as const;
	}
	return "partial" as const;
}

function createPaymentData(
	invoiceIndex: number,
	invoice: InvoiceInsert,
	paymentAmounts: number[],
	companyId: string
) {
	const payments: PaymentInsert[] = [];

	paymentAmounts.forEach((amount, paymentIndex) => {
		const processorFee = Math.floor(amount * PROCESSOR_PERCENT_FEE + PROCESSOR_FIXED_FEE_CENTS);
		payments.push({
			id: crypto.randomUUID(),
			company_id: companyId,
			customer_id: invoice.customer_id,
			invoice_id: invoice.id,
			payment_number: generatePaymentNumber(invoiceIndex, paymentIndex + 1),
			reference_number: `REF-${invoiceIndex}-${paymentIndex + 1}`,
			amount,
			payment_method: randomElement(PAYMENT_METHODS),
			payment_type: "payment",
			status: randomElement(PAYMENT_STATUSES),
			card_brand:
				Math.random() > CARD_DETAIL_PROBABILITY
					? randomElement(["visa", "mastercard", "amex", "discover"] as const)
					: null,
			card_last4:
				Math.random() > CARD_DETAIL_PROBABILITY
					? String(randomInt(CARD_LAST4_MIN, CARD_LAST4_MAX))
					: null,
			processor_name: "stripe",
			processor_transaction_id: `txn_${crypto.randomUUID().slice(0, 24)}`,
			processor_fee: processorFee,
			net_amount: amount - processorFee,
			receipt_number: `RCPT-${invoiceIndex}-${paymentIndex + 1}`,
			receipt_emailed: true,
			processed_at: randomRecentDate(PAYMENT_PROCESSED_DAYS).toISOString(),
			completed_at: randomRecentDate(PAYMENT_COMPLETED_DAYS).toISOString(),
			created_at: randomRecentDate(PAYMENT_CREATED_DAYS).toISOString(),
		});
	});

	return payments;
}

async function insertInvoices(supabase: SupabaseClientType, invoices: InvoiceInsert[]) {
	console.log("💾 Inserting invoices into database...");

	const batchSize = 100;
	let inserted = 0;

	for (let i = 0; i < invoices.length; i += batchSize) {
		const batch = invoices.slice(i, i + batchSize);
		const { error } = await supabase.from("invoices").insert(batch);

		if (error) {
			console.error(`❌ Error inserting invoice batch ${i / batchSize + 1}:`, error);
			throw error;
		}

		inserted += batch.length;
		console.log(`   Inserted ${inserted}/${invoices.length} invoices...`);
	}

	console.log("✅ All invoices inserted\n");
}

async function insertPayments(supabase: SupabaseClientType, payments: PaymentInsert[]) {
	console.log("💾 Inserting payments into database...");

	const batchSize = 100;
	let inserted = 0;

	for (let i = 0; i < payments.length; i += batchSize) {
		const batch = payments.slice(i, i + batchSize);
		const { error } = await supabase.from("payments").insert(batch);

		if (error) {
			console.error(`❌ Error inserting payment batch ${i / batchSize + 1}:`, error);
			throw error;
		}

		inserted += batch.length;
		console.log(`   Inserted ${inserted}/${payments.length} payments...`);
	}

	console.log("✅ All payments inserted\n");
}

function logSummary(invoices: InvoiceInsert[], payments: PaymentInsert[]) {
	console.log("📊 Generation Summary:");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log(`✅ Invoices created:        ${invoices.length.toLocaleString()}`);
	console.log(`✅ Payments created:        ${payments.length.toLocaleString()}`);
	console.log(`✅ Avg payments/invoice:    ${(payments.length / invoices.length).toFixed(1)}`);

	const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
	const totalPaymentAmount = payments.reduce((sum, pay) => sum + pay.amount, 0);
	const totalAmountPaid = invoices.reduce((sum, inv) => sum + inv.amount_paid, 0);

	console.log(
		`💰 Total invoice amount:    $${(totalInvoiceAmount / CENTS_IN_DOLLAR).toLocaleString()}`
	);
	console.log(
		`💰 Total payments made:     $${(totalPaymentAmount / CENTS_IN_DOLLAR).toLocaleString()}`
	);
	console.log(
		`💰 Total amount paid:       $${(totalAmountPaid / CENTS_IN_DOLLAR).toLocaleString()}`
	);

	const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
	const partialInvoices = invoices.filter((inv) => inv.status === "partial").length;
	const sentInvoices = invoices.filter((inv) => inv.status === "sent").length;

	console.log("\n📈 Invoice Status Breakdown:");
	console.log(
		`   Paid:        ${paidInvoices} (${((paidInvoices / invoices.length) * PERCENT_FACTOR).toFixed(STATUS_PERCENT_DECIMALS)}%)`
	);
	console.log(
		`   Partial:     ${partialInvoices} (${((partialInvoices / invoices.length) * PERCENT_FACTOR).toFixed(STATUS_PERCENT_DECIMALS)}%)`
	);
	console.log(
		`   Sent:        ${sentInvoices} (${((sentInvoices / invoices.length) * PERCENT_FACTOR).toFixed(STATUS_PERCENT_DECIMALS)}%)`
	);

	console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("🎉 Generation complete!");
	console.log("\n💡 Test your tables at:");
	console.log("   - /dashboard/invoices");
	console.log("   - /dashboard/payments");
	console.log("   - Check virtualization with 1,000+ rows!");
}

// ============================================================================
// Run Script
// ============================================================================

generateInvoicesAndPayments()
	.then(() => {
		console.log("\n✅ Script completed successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("\n❌ Script failed:", error);
		process.exit(1);
	});
