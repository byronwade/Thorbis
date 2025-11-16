/**
 * Bulk Communications Actions
 *
 * Server actions for sending bulk emails for invoices and estimates
 * with progress tracking and error handling
 */

"use server";

import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { loadInvoiceEmailTemplate } from "@/actions/settings/invoice-email-template";
import type {
	BulkEmailConfig,
	BulkEmailResult,
} from "@/lib/email/bulk-email-sender";
import { sendBulkEmails } from "@/lib/email/bulk-email-sender";
import { EmailTemplate } from "@/lib/email/email-types";
import { generatePaymentToken } from "@/lib/payments/payment-tokens";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Exclude<
	Awaited<ReturnType<typeof createClient>>,
	null
>;

const PAYMENT_TOKEN_TTL_SECONDS = 87_600;
const PAYMENT_TOKEN_MAX_REDEMPTIONS = 999_999;
const CENTS_IN_DOLLAR = 100;
const DEFAULT_CURRENCY = "USD";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? APP_URL;
const VALUED_CUSTOMER_LABEL = "Valued Customer";
const FALLBACK_COMPANY_NAME = "Company";
const TRAILING_SLASH_REGEX = /\/$/;

type InvoiceTemplateConfig = {
	subject: string;
	body: string;
	footer: string;
};

const DEFAULT_INVOICE_TEMPLATE: InvoiceTemplateConfig = {
	subject: "Invoice {{invoice_number}} from {{company_name}}",
	body: "Hi {{customer_name}},\n\nPlease find attached your invoice {{invoice_number}} for {{invoice_amount}}.\n\nPayment is due by {{due_date}}.\n\nYou can securely pay your invoice online:\n{{payment_link}}\n\nThank you!",
	footer: "",
};

class BulkSendError extends Error {
	readonly userMessage: string;
	readonly details?: string;

	constructor(userMessage: string, details?: string) {
		super(userMessage);
		this.name = "BulkSendError";
		this.userMessage = userMessage;
		this.details = details;
	}
}

type CustomerRecord = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	company_name: string | null;
};

type InvoiceRow = {
	id: string;
	invoice_number: string;
	total_amount: number | null;
	status: string | null;
	company_id: string;
	customer_id: string | null;
	job_id: string | null;
	created_at: string | null;
	due_date: string | null;
	notes: string | null;
	customer: CustomerRecord | CustomerRecord[] | null;
};

type NormalizedInvoice = Omit<InvoiceRow, "customer"> & {
	customer: CustomerRecord | null;
};

type InvoiceWithEmail = NormalizedInvoice & {
	customer: CustomerRecord & { email: string };
};

type CompanyProfile = {
	name: string | null;
	email: string | null;
	phone: string | null;
};

type BulkSendInvoicesResult = {
	success: boolean;
	message: string;
	results?: BulkEmailResult;
	error?: string;
};

/**
 * Send multiple invoices via email
 *
 * @param invoiceIds - Array of invoice IDs to send
 * @param config - Optional configuration for batch processing
 * @returns Result with success/failure counts
 */
export async function bulkSendInvoices(
	invoiceIds: string[],
	config?: BulkEmailConfig,
): Promise<BulkSendInvoicesResult> {
	try {
		const supabase = await ensureSupabaseClient();
		const user = await requireUser(supabase);
		const companyId = await requireCompanyId(supabase, user.id);
		const invoices = await fetchInvoicesWithCustomers(
			supabase,
			invoiceIds,
			companyId,
		);
		const normalizedInvoices = normalizeInvoices(invoices);
		const validInvoices = normalizedInvoices.filter(hasCustomerEmail);

		if (validInvoices.length === 0) {
			throw new BulkSendError(
				"No valid invoices to send",
				"None of the selected invoices have customer email addresses",
			);
		}

		const [emailTemplate, company] = await Promise.all([
			loadInvoiceTemplateConfig(),
			fetchCompanyProfile(supabase, companyId),
		]);

		const emails = await buildInvoiceEmails({
			invoices: validInvoices,
			emailTemplate,
			company,
		});

		const results = await sendBulkEmails(emails, config);
		const successfulInvoiceIds = getSuccessfulItemIds(results);

		if (successfulInvoiceIds.length > 0) {
			await markInvoicesSent(supabase, successfulInvoiceIds);
		}

		revalidateInvoices(successfulInvoiceIds);

		return {
			success: results.allSuccessful,
			message: buildInvoiceResultMessage({
				results,
				total: invoices.length,
				valid: validInvoices.length,
			}),
			results,
		};
	} catch (error) {
		return buildBulkSendFailure("Failed to send invoices", error);
	}
}

type BuildInvoiceEmailsParams = {
	invoices: InvoiceWithEmail[];
	emailTemplate: InvoiceTemplateConfig;
	company?: CompanyProfile | null;
};

type EmailPayload = Parameters<typeof sendBulkEmails>[0][number];

const ensureSupabaseClient = async (): Promise<SupabaseServerClient> => {
	const supabase = await createClient();
	if (!supabase) {
		throw new BulkSendError(
			"Database connection failed",
			"Unable to connect to database",
		);
	}
	return supabase as SupabaseServerClient;
};

const requireUser = async (supabase: SupabaseServerClient) => {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		throw new BulkSendError(
			"Authentication required",
			"You must be logged in to send invoices",
		);
	}
	return user;
};

const requireCompanyId = async (
	supabase: SupabaseServerClient,
	userId: string,
): Promise<string> => {
	const { data, error } = await supabase
		.from("team_members")
		.select("company_id")
		.eq("user_id", userId)
		.eq("status", "active")
		.limit(1)
		.single();

	if (error) {
		throw new BulkSendError(
			"Failed to verify company membership",
			error.message,
		);
	}

	if (!data?.company_id) {
		throw new BulkSendError(
			"Company association required",
			"You must be part of a company to send invoices",
		);
	}

	return data.company_id;
};

const fetchInvoicesWithCustomers = async (
	supabase: SupabaseServerClient,
	invoiceIds: string[],
	companyId: string,
): Promise<InvoiceRow[]> => {
	const { data, error } = await supabase
		.from("invoices")
		.select(
			`
        id,
        invoice_number,
        total_amount,
        status,
        company_id,
        customer_id,
        job_id,
        created_at,
        due_date,
        notes,
        customer:customers!customer_id(
          id,
          first_name,
          last_name,
          email,
          company_name
        )
      `,
		)
		.in("id", invoiceIds)
		.eq("company_id", companyId);

	if (error || !data) {
		throw new BulkSendError(
			"Failed to fetch invoices",
			error?.message || "Unable to retrieve invoices",
		);
	}

	return data as InvoiceRow[];
};

const normalizeInvoices = (invoices: InvoiceRow[]): NormalizedInvoice[] =>
	invoices.map((invoice) => {
		const rawCustomer = invoice.customer;
		const customer = Array.isArray(rawCustomer)
			? (rawCustomer[0] ?? null)
			: rawCustomer;
		return { ...invoice, customer };
	});

const hasCustomerEmail = (
	invoice: NormalizedInvoice,
): invoice is InvoiceWithEmail => Boolean(invoice.customer?.email);

const loadInvoiceTemplateConfig = async (): Promise<InvoiceTemplateConfig> => {
	const templateResult = await loadInvoiceEmailTemplate();
	if (templateResult.success && templateResult.data) {
		return templateResult.data;
	}
	return DEFAULT_INVOICE_TEMPLATE;
};

const fetchCompanyProfile = async (
	supabase: SupabaseServerClient,
	companyId: string,
): Promise<CompanyProfile | null> => {
	const { data, error } = await supabase
		.from("companies")
		.select("name, email, phone")
		.eq("id", companyId)
		.single();

	if (error) {
		throw new BulkSendError("Failed to load company profile", error.message);
	}

	return data ?? null;
};

const buildInvoiceEmails = async ({
	invoices,
	emailTemplate,
	company,
}: BuildInvoiceEmailsParams): Promise<EmailPayload[]> => {
	const { InvoiceEmail } = await import("@/lib/email/templates");

	return Promise.all(
		invoices.map(async (invoice) => {
			const paymentLink = await resolvePaymentLink(invoice.id);
			const customerName = resolveCustomerName(invoice.customer);
			const replacements = {
				"{{customer_name}}": customerName,
				"{{invoice_number}}": invoice.invoice_number,
				"{{invoice_amount}}": formatInvoiceAmount(invoice.total_amount),
				"{{due_date}}": formatInvoiceDueDate(invoice.due_date),
				"{{payment_link}}": paymentLink,
				"{{company_name}}": company?.name || FALLBACK_COMPANY_NAME,
				"{{company_email}}": company?.email || "",
				"{{company_phone}}": company?.phone || "",
			};

			let subject = emailTemplate.subject;
			let body = emailTemplate.body;
			let footer = emailTemplate.footer;

			for (const [key, value] of Object.entries(replacements)) {
				const pattern = new RegExp(key, "g");
				subject = subject.replace(pattern, value);
				body = body.replace(pattern, value);
				footer = footer.replace(pattern, value);
			}

			return {
				to: invoice.customer.email,
				subject,
				template: InvoiceEmail({
					invoiceNumber: invoice.invoice_number,
					customerName,
					invoiceDate: invoice.created_at ?? new Date().toISOString(),
					dueDate: invoice.due_date ?? undefined,
					totalAmount: invoice.total_amount ?? 0,
					notes: invoice.notes ?? undefined,
					invoiceUrl: `${APP_URL}/dashboard/work/invoices/${invoice.id}`,
					paymentLink,
					customBody: body,
					customFooter: footer,
				}),
				templateType: EmailTemplate.INVOICE,
				itemId: invoice.id,
				tags: [
					{ name: "invoice_id", value: invoice.id },
					{ name: "invoice_number", value: invoice.invoice_number },
					{ name: "has_payment_link", value: "true" },
				],
			};
		}),
	);
};

const resolvePaymentLink = async (invoiceId: string): Promise<string> => {
	const paymentToken = await generatePaymentToken(
		invoiceId,
		PAYMENT_TOKEN_TTL_SECONDS,
		PAYMENT_TOKEN_MAX_REDEMPTIONS,
	);
	const baseUrl = APP_URL ? APP_URL.replace(TRAILING_SLASH_REGEX, "") : "";
	return (
		paymentToken?.paymentLink ||
		`${baseUrl}/pay/${encodeURIComponent(invoiceId)}`
	);
};

const resolveCustomerName = (
	customer: CustomerRecord & { email: string },
): string =>
	customer?.company_name ||
	`${customer?.first_name ?? ""} ${customer?.last_name ?? ""}`.trim() ||
	VALUED_CUSTOMER_LABEL;

const formatInvoiceAmount = (amount: number | null | undefined): string =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: DEFAULT_CURRENCY,
	}).format(((amount ?? 0) as number) / CENTS_IN_DOLLAR);

const formatInvoiceDueDate = (date: string | null): string =>
	date ? format(new Date(date), "MMMM dd, yyyy") : "Upon receipt";

const getSuccessfulItemIds = (results: BulkEmailResult): string[] => {
	const items = results.results ?? [];
	return items
		.filter(
			(item): item is typeof item & { itemId: string } =>
				Boolean(item.itemId) && item.success,
		)
		.map((item) => item.itemId as string);
};

const markInvoicesSent = async (
	supabase: SupabaseServerClient,
	invoiceIds: string[],
) => {
	const { error } = await supabase
		.from("invoices")
		.update({
			sent_at: new Date().toISOString(),
			status: "sent",
		})
		.in("id", invoiceIds);

	if (error) {
		throw new BulkSendError("Failed to update invoice statuses", error.message);
	}
};

const revalidateInvoices = (invoiceIds: string[]): void => {
	revalidatePath("/dashboard/work/invoices");
	for (const id of invoiceIds) {
		revalidatePath(`/dashboard/work/invoices/${id}`);
	}
};

const buildInvoiceResultMessage = ({
	results,
	total,
	valid,
}: {
	results: BulkEmailResult;
	total: number;
	valid: number;
}): string => {
	const skippedCount = total - valid;
	const parts = [
		`Successfully sent ${results.successful} invoice${results.successful !== 1 ? "s" : ""}`,
	];

	if (results.failed > 0) {
		parts.push(`${results.failed} failed`);
	}

	if (skippedCount > 0) {
		parts.push(`${skippedCount} skipped (no email)`);
	}

	return parts.join(", ");
};

const buildEstimateEmails = async (
	estimates: InvoiceWithEmail[],
): Promise<EmailPayload[]> => {
	const { EstimateEmail } = await import("@/lib/email/templates");
	return estimates.map((estimate) => ({
		to: estimate.customer.email,
		subject: `Estimate ${estimate.invoice_number}`,
		template: EstimateEmail({
			estimateNumber: estimate.invoice_number,
			customerName: resolveCustomerName(estimate.customer),
			estimateDate: estimate.created_at ?? new Date().toISOString(),
			validUntil: estimate.due_date ?? undefined,
			totalAmount: estimate.total_amount ?? 0,
			notes: estimate.notes ?? undefined,
			estimateUrl: `${SITE_URL}/dashboard/work/estimates/${estimate.id}`,
		}),
		templateType: EmailTemplate.ESTIMATE,
		itemId: estimate.id,
		tags: [
			{ name: "estimate_id", value: estimate.id },
			{ name: "estimate_number", value: estimate.invoice_number },
		],
	}));
};

const revalidateEstimates = (estimateIds: string[]): void => {
	revalidatePath("/dashboard/work/estimates");
	for (const id of estimateIds) {
		revalidatePath(`/dashboard/work/estimates/${id}`);
	}
};

const buildEstimateResultMessage = ({
	results,
	total,
	valid,
}: {
	results: BulkEmailResult;
	total: number;
	valid: number;
}): string => {
	const skippedCount = total - valid;
	const parts = [
		`Successfully sent ${results.successful} estimate${results.successful !== 1 ? "s" : ""}`,
	];

	if (results.failed > 0) {
		parts.push(`${results.failed} failed`);
	}

	if (skippedCount > 0) {
		parts.push(`${skippedCount} skipped (no email)`);
	}

	return parts.join(", ");
};

const buildBulkSendFailure = (
	fallbackMessage: string,
	error: unknown,
): BulkSendInvoicesResult => {
	if (error instanceof BulkSendError) {
		return {
			success: false,
			message: error.userMessage,
			error: error.details ?? error.userMessage,
		};
	}

	return {
		success: false,
		message: fallbackMessage,
		error: error instanceof Error ? error.message : "Unknown error",
	};
};

/**
 * Send multiple estimates via email
 *
 * @param estimateIds - Array of estimate IDs to send
 * @param config - Optional configuration for batch processing
 * @returns Result with success/failure counts
 */
export async function bulkSendEstimates(
	estimateIds: string[],
	config?: BulkEmailConfig,
): Promise<BulkSendInvoicesResult> {
	try {
		const supabase = await ensureSupabaseClient();
		const user = await requireUser(supabase);
		const companyId = await requireCompanyId(supabase, user.id);
		const estimates = await fetchInvoicesWithCustomers(
			supabase,
			estimateIds,
			companyId,
		);
		const normalizedEstimates = normalizeInvoices(estimates);
		const validEstimates = normalizedEstimates.filter(hasCustomerEmail);

		if (validEstimates.length === 0) {
			throw new BulkSendError(
				"No valid estimates to send",
				"None of the selected estimates have customer email addresses",
			);
		}

		const emails = await buildEstimateEmails(validEstimates);
		const results = await sendBulkEmails(emails, config);
		const successfulEstimateIds = getSuccessfulItemIds(results);

		if (successfulEstimateIds.length > 0) {
			await markInvoicesSent(supabase, successfulEstimateIds);
		}

		revalidateEstimates(successfulEstimateIds);

		return {
			success: results.allSuccessful,
			message: buildEstimateResultMessage({
				results,
				total: estimates.length,
				valid: validEstimates.length,
			}),
			results,
		};
	} catch (error) {
		return buildBulkSendFailure("Failed to send estimates", error);
	}
}
