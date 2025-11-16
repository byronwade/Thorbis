/**
 * Payment Plan Server Actions
 *
 * Manages payment plans, schedules, and financing:
 * - Create payment plans with down payments
 * - Weekly, bi-weekly, monthly payment schedules
 * - Auto-payment via Stripe
 * - Late fee tracking
 * - Payment schedule management
 */

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ActionError, ERROR_CODES, ERROR_MESSAGES } from "@/lib/errors/action-error";
import {
	type ActionResult,
	assertAuthenticated,
	assertExists,
	withErrorHandling,
} from "@/lib/errors/with-error-handling";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const createPaymentPlanSchema = z.object({
	customerId: z.string().uuid("Invalid customer ID"),
	invoiceId: z.string().uuid("Invalid invoice ID").optional(),
	totalAmount: z.number().min(1, "Total amount must be greater than 0"),
	downPaymentAmount: z.number().min(0).default(0),
	paymentFrequency: z.enum(["weekly", "bi_weekly", "monthly", "quarterly"]),
	numberOfPayments: z.number().int().min(1),
	startDate: z.string(), // ISO date string
	hasInterest: z.boolean().default(false),
	interestRate: z.number().min(0).default(0),
	setupFee: z.number().min(0).default(0),
	lateFee: z.number().min(0).default(0),
	gracePeriodDays: z.number().int().min(0).default(0),
	autoPayEnabled: z.boolean().default(false),
	stripePaymentMethodId: z.string().optional(),
	notes: z.string().optional(),
	terms: z.string().optional(),
});

const recordPaymentSchema = z.object({
	scheduleId: z.string().uuid("Invalid schedule ID"),
	paymentId: z.string().uuid("Invalid payment ID"),
	amount: z.number().min(1),
});

// ============================================================================
// PAYMENT PLAN CRUD
// ============================================================================

/**
 * Create payment plan
 */
export async function createPaymentPlan(formData: FormData): Promise<ActionResult<string>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		const data = createPaymentPlanSchema.parse({
			customerId: formData.get("customerId"),
			invoiceId: formData.get("invoiceId") || undefined,
			totalAmount: Number.parseFloat(formData.get("totalAmount") as string),
			downPaymentAmount: formData.get("downPaymentAmount")
				? Number.parseFloat(formData.get("downPaymentAmount") as string)
				: 0,
			paymentFrequency: formData.get("paymentFrequency") as any,
			numberOfPayments: Number.parseInt(formData.get("numberOfPayments") as string, 10),
			startDate: formData.get("startDate") as string,
			hasInterest: formData.get("hasInterest") === "true",
			interestRate: formData.get("interestRate") ? Number.parseFloat(formData.get("interestRate") as string) : 0,
			setupFee: formData.get("setupFee") ? Number.parseFloat(formData.get("setupFee") as string) : 0,
			lateFee: formData.get("lateFee") ? Number.parseFloat(formData.get("lateFee") as string) : 0,
			gracePeriodDays: formData.get("gracePeriodDays")
				? Number.parseInt(formData.get("gracePeriodDays") as string, 10)
				: 0,
			autoPayEnabled: formData.get("autoPayEnabled") === "true",
			stripePaymentMethodId: formData.get("stripePaymentMethodId") || undefined,
			notes: formData.get("notes") || undefined,
			terms: formData.get("terms") || undefined,
		});

		// Verify customer belongs to company
		const { data: customer } = await supabase.from("customers").select("company_id").eq("id", data.customerId).single();

		assertExists(customer, "Customer");

		if (customer.company_id !== teamMember.company_id) {
			throw new ActionError(ERROR_MESSAGES.forbidden("customer"), ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Calculate financed amount
		const financedAmount = data.totalAmount - data.downPaymentAmount;
		const paymentAmount = Math.ceil(financedAmount / data.numberOfPayments);

		// Generate plan number
		const planNumber = `PLAN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

		// Calculate dates
		const startDate = new Date(data.startDate);
		const firstPaymentDate = new Date(startDate);

		// Calculate final payment date based on frequency
		const finalPaymentDate = new Date(firstPaymentDate);
		switch (data.paymentFrequency) {
			case "weekly":
				finalPaymentDate.setDate(finalPaymentDate.getDate() + (data.numberOfPayments - 1) * 7);
				break;
			case "bi_weekly":
				finalPaymentDate.setDate(finalPaymentDate.getDate() + (data.numberOfPayments - 1) * 14);
				break;
			case "monthly":
				finalPaymentDate.setMonth(finalPaymentDate.getMonth() + (data.numberOfPayments - 1));
				break;
			case "quarterly":
				finalPaymentDate.setMonth(finalPaymentDate.getMonth() + (data.numberOfPayments - 1) * 3);
				break;
		}

		// Create payment plan
		const { data: paymentPlan, error: createError } = await supabase
			.from("payment_plans")
			.insert({
				company_id: teamMember.company_id,
				customer_id: data.customerId,
				invoice_id: data.invoiceId,
				plan_number: planNumber,
				plan_name: (formData.get("planName") as string) || `Payment Plan for ${data.customerId.slice(0, 8)}`,
				total_amount: Math.round(data.totalAmount * 100), // Convert to cents
				down_payment_amount: Math.round(data.downPaymentAmount * 100),
				financed_amount: Math.round(financedAmount * 100),
				payment_frequency: data.paymentFrequency,
				number_of_payments: data.numberOfPayments,
				payment_amount: Math.round(paymentAmount * 100),
				start_date: startDate.toISOString().split("T")[0],
				first_payment_date: firstPaymentDate.toISOString().split("T")[0],
				final_payment_date: finalPaymentDate.toISOString().split("T")[0],
				has_interest: data.hasInterest,
				interest_rate: data.interestRate,
				setup_fee: Math.round(data.setupFee * 100),
				late_fee: Math.round(data.lateFee * 100),
				grace_period_days: data.gracePeriodDays,
				amount_remaining: Math.round(financedAmount * 100),
				next_payment_due_date: firstPaymentDate.toISOString().split("T")[0],
				auto_pay_enabled: data.autoPayEnabled,
				auto_pay_stripe_payment_method_id: data.stripePaymentMethodId,
				notes: data.notes,
				terms: data.terms,
			})
			.select("id")
			.single();

		if (createError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("create payment plan"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Create payment schedule
		await createPaymentSchedule(paymentPlan.id, {
			numberOfPayments: data.numberOfPayments,
			paymentAmount: Math.round(paymentAmount * 100),
			firstPaymentDate,
			frequency: data.paymentFrequency,
		});

		// Update invoice if provided
		if (data.invoiceId) {
			await supabase
				.from("invoices")
				.update({
					has_payment_plan: true,
					payment_plan_id: paymentPlan.id,
				})
				.eq("id", data.invoiceId);
		}

		revalidatePath(`/dashboard/customers/${data.customerId}`);
		revalidatePath("/dashboard/finances/payment-plans");

		return paymentPlan.id;
	});
}

/**
 * Create payment schedule items
 */
async function createPaymentSchedule(
	paymentPlanId: string,
	config: {
		numberOfPayments: number;
		paymentAmount: number;
		firstPaymentDate: Date;
		frequency: string;
	}
) {
	const supabase = await createClient();
	if (!supabase) {
		return;
	}

	const scheduleItems = [];
	const currentDate = new Date(config.firstPaymentDate);

	for (let i = 1; i <= config.numberOfPayments; i++) {
		scheduleItems.push({
			payment_plan_id: paymentPlanId,
			payment_number: i,
			due_date: currentDate.toISOString().split("T")[0],
			amount_due: config.paymentAmount,
			status: "pending",
		});

		// Calculate next date
		switch (config.frequency) {
			case "weekly":
				currentDate.setDate(currentDate.getDate() + 7);
				break;
			case "bi_weekly":
				currentDate.setDate(currentDate.getDate() + 14);
				break;
			case "monthly":
				currentDate.setMonth(currentDate.getMonth() + 1);
				break;
			case "quarterly":
				currentDate.setMonth(currentDate.getMonth() + 3);
				break;
		}
	}

	await supabase.from("payment_plan_schedules").insert(scheduleItems);
}

/**
 * Record payment against schedule
 */
export async function recordScheduledPayment(formData: FormData): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const data = recordPaymentSchema.parse({
			scheduleId: formData.get("scheduleId"),
			paymentId: formData.get("paymentId"),
			amount: Number.parseFloat(formData.get("amount") as string),
		});

		// Update schedule item
		const { error: updateError } = await supabase
			.from("payment_plan_schedules")
			.update({
				status: "paid",
				paid_at: new Date().toISOString(),
				amount_paid: Math.round(data.amount * 100),
				payment_id: data.paymentId,
			})
			.eq("id", data.scheduleId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("record payment"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update payment plan totals
		const { data: schedule } = await supabase
			.from("payment_plan_schedules")
			.select("payment_plan_id, amount_paid")
			.eq("id", data.scheduleId)
			.single();

		if (schedule) {
			const { data: plan } = await supabase
				.from("payment_plans")
				.select("payments_made, amount_paid, financed_amount")
				.eq("id", schedule.payment_plan_id)
				.single();

			if (plan) {
				const newPaymentsMade = plan.payments_made + 1;
				const newAmountPaid = plan.amount_paid + schedule.amount_paid;
				const newAmountRemaining = plan.financed_amount - newAmountPaid;

				await supabase
					.from("payment_plans")
					.update({
						payments_made: newPaymentsMade,
						amount_paid: newAmountPaid,
						amount_remaining: Math.max(0, newAmountRemaining),
						last_payment_date: new Date().toISOString().split("T")[0],
						status: newAmountRemaining <= 0 ? "completed" : "active",
						completed_at: newAmountRemaining <= 0 ? new Date().toISOString() : null,
					})
					.eq("id", schedule.payment_plan_id);

				// Get next pending payment
				const { data: nextPayment } = await supabase
					.from("payment_plan_schedules")
					.select("due_date")
					.eq("payment_plan_id", schedule.payment_plan_id)
					.eq("status", "pending")
					.order("due_date", { ascending: true })
					.limit(1)
					.maybeSingle();

				if (nextPayment) {
					await supabase
						.from("payment_plans")
						.update({ next_payment_due_date: nextPayment.due_date })
						.eq("id", schedule.payment_plan_id);
				}
			}
		}

		revalidatePath("/dashboard/finances/payment-plans");
	});
}

/**
 * Get payment plan with schedules
 */
export async function getPaymentPlan(planId: string): Promise<ActionResult<any>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		const { data: paymentPlan, error } = await supabase
			.from("payment_plans")
			.select(`
        *,
        customer:customers(*),
        invoice:invoices(*),
        schedules:payment_plan_schedules(*)
      `)
			.eq("id", planId)
			.eq("company_id", teamMember.company_id)
			.single();

		if (error) {
			throw new ActionError(ERROR_MESSAGES.notFound("Payment plan"), ERROR_CODES.DB_RECORD_NOT_FOUND, 404);
		}

		return paymentPlan;
	});
}

/**
 * Get upcoming payments (across all payment plans)
 */
export async function getUpcomingPayments(daysAhead = 30): Promise<ActionResult<any[]>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		const endDate = new Date();
		endDate.setDate(endDate.getDate() + daysAhead);

		const { data: upcomingPayments, error } = await supabase
			.from("payment_plan_schedules")
			.select(`
        *,
        payment_plan:payment_plans(
          *,
          customer:customers(first_name, last_name, email, phone)
        )
      `)
			.in("status", ["pending", "late"])
			.lte("due_date", endDate.toISOString().split("T")[0])
			.order("due_date", { ascending: true });

		if (error) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("fetch upcoming payments"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Filter by company through payment plan
		const filtered = (upcomingPayments || []).filter((payment: any) => {
			const plan = Array.isArray(payment.payment_plan) ? payment.payment_plan[0] : payment.payment_plan;
			return plan?.company_id === teamMember.company_id;
		});

		return filtered;
	});
}

/**
 * Apply late fee to overdue payment
 */
export async function applyLateFee(scheduleId: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		// Get schedule with payment plan
		const { data: schedule } = await supabase
			.from("payment_plan_schedules")
			.select(`
        *,
        payment_plan:payment_plans(late_fee, company_id)
      `)
			.eq("id", scheduleId)
			.single();

		assertExists(schedule, "Payment schedule");

		const plan = Array.isArray(schedule.payment_plan) ? schedule.payment_plan[0] : schedule.payment_plan;

		// Check if already late fee applied
		if (schedule.late_fee_applied > 0) {
			throw new ActionError("Late fee already applied", ERROR_CODES.OPERATION_NOT_ALLOWED);
		}

		// Apply late fee
		const { error: updateError } = await supabase
			.from("payment_plan_schedules")
			.update({
				is_late: true,
				late_fee_applied: plan.late_fee,
				late_since_date: new Date().toISOString().split("T")[0],
				amount_due: schedule.amount_due + plan.late_fee,
			})
			.eq("id", scheduleId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("apply late fee"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Update payment plan missed payments count
		await supabase
			.from("payment_plans")
			.update({
				missed_payments: await supabase
					.from("payment_plan_schedules")
					.select("id", { count: "exact" })
					.eq("payment_plan_id", plan.id)
					.eq("is_late", true)
					.then(({ count }) => count || 0),
			})
			.eq("id", plan.id);

		revalidatePath("/dashboard/finances/payment-plans");
	});
}

/**
 * Cancel payment plan
 */
export async function cancelPaymentPlan(planId: string, reason: string): Promise<ActionResult<void>> {
	return withErrorHandling(async () => {
		const supabase = await createClient();
		if (!supabase) {
			throw new ActionError("Database connection failed", ERROR_CODES.DB_CONNECTION_ERROR);
		}

		const {
			data: { user },
		} = await supabase.auth.getUser();
		assertAuthenticated(user?.id);

		const { data: teamMember } = await supabase
			.from("team_members")
			.select("company_id")
			.eq("user_id", user.id)
			.single();

		if (!teamMember?.company_id) {
			throw new ActionError("You must be part of a company", ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Verify plan belongs to company
		const { data: plan } = await supabase
			.from("payment_plans")
			.select("company_id, customer_id")
			.eq("id", planId)
			.single();

		assertExists(plan, "Payment plan");

		if (plan.company_id !== teamMember.company_id) {
			throw new ActionError(ERROR_MESSAGES.forbidden("payment plan"), ERROR_CODES.AUTH_FORBIDDEN, 403);
		}

		// Cancel plan
		const { error: updateError } = await supabase
			.from("payment_plans")
			.update({
				status: "cancelled",
				cancelled_at: new Date().toISOString(),
				cancellation_reason: reason,
			})
			.eq("id", planId);

		if (updateError) {
			throw new ActionError(ERROR_MESSAGES.operationFailed("cancel payment plan"), ERROR_CODES.DB_QUERY_ERROR);
		}

		// Cancel all pending schedule items
		await supabase
			.from("payment_plan_schedules")
			.update({ status: "skipped" })
			.eq("payment_plan_id", planId)
			.eq("status", "pending");

		revalidatePath(`/dashboard/customers/${plan.customer_id}`);
		revalidatePath("/dashboard/finances/payment-plans");
	});
}
