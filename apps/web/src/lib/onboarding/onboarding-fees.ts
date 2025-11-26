/**
 * Onboarding Fees & Pricing Configuration
 *
 * Defines all fees, add-on pricing, and cost calculations for the onboarding flow.
 * Used to calculate upfront costs and monthly recurring charges based on
 * contractor selections during onboarding.
 *
 * Pricing Structure:
 * - Phone Porting: $15 one-time per number
 * - New Phone Number: $5 one-time + $2/month per number
 * - Gmail Workspace: $6/user/month (Google Workspace passthrough)
 * - Profit Rhino: $149/month (flat rate add-on)
 * - Base Platform: $200/month (existing)
 *
 * Payment Flow:
 * 1. Collect payment method during onboarding
 * 2. Start 14-day free trial
 * 3. Charge upfront fees immediately (porting + new number setup)
 * 4. Charge monthly fees at end of trial (recurring charges)
 *
 * @see /docs/billing/ONBOARDING_PAYMENT_FLOW.md
 */

// =============================================================================
// ONE-TIME FEES
// =============================================================================

/**
 * Phone number porting fee (per number)
 * One-time charge when contractor ports existing phone number from another carrier
 */
export const PHONE_PORTING_FEE = 15.0;

/**
 * New phone number setup fee (per number)
 * One-time charge when contractor gets a new phone number from Telnyx
 */
export const PHONE_NEW_NUMBER_SETUP_FEE = 5.0;

// =============================================================================
// MONTHLY RECURRING FEES
// =============================================================================

/**
 * Base platform fee (per company)
 * Includes: CRM, scheduling, unlimited users, base communication features
 */
export const BASE_PLATFORM_FEE = 200.0;

/**
 * New phone number monthly fee (per number)
 * Recurring charge for each phone number provisioned through Telnyx
 */
export const PHONE_NEW_NUMBER_MONTHLY_FEE = 2.0;

/**
 * Gmail Workspace fee (per user per month)
 * Passthrough of Google Workspace Business Starter cost ($6/user/month)
 * Includes: Gmail, Google Drive (30GB), Calendar, Meet
 */
export const GMAIL_WORKSPACE_PER_USER_FEE = 6.0;

/**
 * Profit Rhino flat rate pricing add-on (per month)
 * Customer financing platform with prebuilt price books
 * Includes: Flat rate price book, quarterly updates, financing options
 *
 * @see https://profitrhino.com/
 */
export const PROFIT_RHINO_MONTHLY_FEE = 149.0;

// =============================================================================
// STRIPE PRICE ID MAPPINGS
// =============================================================================

/**
 * Stripe Price IDs for onboarding charges
 * These must match the price IDs created in Stripe Dashboard
 *
 * To create these prices:
 * 1. Go to Stripe Dashboard → Products
 * 2. Create products for each item below
 * 3. Create prices (one-time or recurring as noted)
 * 4. Copy price IDs and set in environment variables
 * 5. Update this mapping
 *
 * @see /docs/billing/STRIPE_SETUP.md
 */
export const STRIPE_PRICE_IDS = {
	// One-time charges
	PHONE_PORTING: process.env.STRIPE_PRICE_ID_PHONE_PORTING || "",
	PHONE_NEW_NUMBER_SETUP:
		process.env.STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP || "",

	// Monthly recurring charges
	BASE_PLAN: process.env.STRIPE_PRICE_ID_BASE_PLAN || "",
	PHONE_NEW_NUMBER_MONTHLY:
		process.env.STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY || "",
	GMAIL_WORKSPACE_PER_USER:
		process.env.STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER || "",
	PROFIT_RHINO: process.env.STRIPE_PRICE_ID_PROFIT_RHINO || "",
} as const;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Onboarding selections that affect billing
 */
export interface OnboardingBillingSelections {
	/** Number of phone numbers being ported from another carrier */
	phonePortingCount: number;

	/** Number of new phone numbers being purchased */
	newPhoneNumberCount: number;

	/** Number of users who need Gmail Workspace access */
	gmailWorkspaceUsers: number;

	/** Whether Profit Rhino financing add-on is enabled */
	profitRhinoEnabled: boolean;
}

/**
 * Calculated costs breakdown
 */
export interface OnboardingCostBreakdown {
	/** One-time upfront charges (charged immediately) */
	oneTime: {
		phonePorting: number;
		phoneSetup: number;
		total: number;
	};

	/** Monthly recurring charges (charged after 14-day trial) */
	monthly: {
		basePlatform: number;
		phoneNumbers: number;
		gmailWorkspace: number;
		profitRhino: number;
		total: number;
	};

	/** Grand total of first month (upfront + monthly after trial) */
	firstMonthTotal: number;
}

/**
 * Stripe subscription items for onboarding
 */
export interface StripeSubscriptionItem {
	price: string; // Stripe price ID
	quantity?: number; // For per-user or per-number charges
}

// =============================================================================
// COST CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate all onboarding costs based on contractor selections
 *
 * @param selections - Contractor's choices during onboarding
 * @returns Detailed cost breakdown
 *
 * @example
 * const selections = {
 *   phonePortingCount: 1,
 *   newPhoneNumberCount: 1,
 *   gmailWorkspaceUsers: 5,
 *   profitRhinoEnabled: true
 * };
 *
 * const costs = calculateOnboardingCosts(selections);
 * console.log(costs.oneTime.total); // $20 ($15 porting + $5 setup)
 * console.log(costs.monthly.total); // $381 ($200 + $2 + $30 + $149)
 */
export function calculateOnboardingCosts(
	selections: OnboardingBillingSelections,
): OnboardingCostBreakdown {
	// Calculate one-time charges
	const phonePortingCost = selections.phonePortingCount * PHONE_PORTING_FEE;
	const phoneSetupCost =
		selections.newPhoneNumberCount * PHONE_NEW_NUMBER_SETUP_FEE;
	const oneTimeTotal = phonePortingCost + phoneSetupCost;

	// Calculate monthly recurring charges
	const basePlatformCost = BASE_PLATFORM_FEE;
	const phoneNumbersMonthlyCost =
		selections.newPhoneNumberCount * PHONE_NEW_NUMBER_MONTHLY_FEE;
	const gmailWorkspaceCost =
		selections.gmailWorkspaceUsers * GMAIL_WORKSPACE_PER_USER_FEE;
	const profitRhinoCost = selections.profitRhinoEnabled
		? PROFIT_RHINO_MONTHLY_FEE
		: 0;
	const monthlyTotal =
		basePlatformCost +
		phoneNumbersMonthlyCost +
		gmailWorkspaceCost +
		profitRhinoCost;

	// Grand total for first month (upfront + first month after trial)
	const firstMonthTotal = oneTimeTotal + monthlyTotal;

	return {
		oneTime: {
			phonePorting: phonePortingCost,
			phoneSetup: phoneSetupCost,
			total: oneTimeTotal,
		},
		monthly: {
			basePlatform: basePlatformCost,
			phoneNumbers: phoneNumbersMonthlyCost,
			gmailWorkspace: gmailWorkspaceCost,
			profitRhino: profitRhinoCost,
			total: monthlyTotal,
		},
		firstMonthTotal,
	};
}

/**
 * Build Stripe subscription items array for onboarding checkout
 *
 * Creates the subscription items array needed for Stripe Checkout Session
 * or Subscription creation, including base plan and all selected add-ons.
 *
 * @param selections - Contractor's onboarding selections
 * @returns Array of Stripe subscription items
 *
 * @example
 * const selections = {
 *   phonePortingCount: 0,
 *   newPhoneNumberCount: 2,
 *   gmailWorkspaceUsers: 5,
 *   profitRhinoEnabled: true
 * };
 *
 * const items = buildStripeSubscriptionItems(selections);
 * // Returns:
 * // [
 * //   { price: 'price_base_plan', quantity: 1 },
 * //   { price: 'price_phone_monthly', quantity: 2 },
 * //   { price: 'price_gmail_per_user', quantity: 5 },
 * //   { price: 'price_profit_rhino', quantity: 1 }
 * // ]
 */
export function buildStripeSubscriptionItems(
	selections: OnboardingBillingSelections,
): StripeSubscriptionItem[] {
	const items: StripeSubscriptionItem[] = [];

	// Base platform (always included)
	items.push({
		price: STRIPE_PRICE_IDS.BASE_PLAN,
		quantity: 1,
	});

	// New phone numbers (monthly recurring)
	if (selections.newPhoneNumberCount > 0) {
		items.push({
			price: STRIPE_PRICE_IDS.PHONE_NEW_NUMBER_MONTHLY,
			quantity: selections.newPhoneNumberCount,
		});
	}

	// Gmail Workspace users
	if (selections.gmailWorkspaceUsers > 0) {
		items.push({
			price: STRIPE_PRICE_IDS.GMAIL_WORKSPACE_PER_USER,
			quantity: selections.gmailWorkspaceUsers,
		});
	}

	// Profit Rhino add-on
	if (selections.profitRhinoEnabled) {
		items.push({
			price: STRIPE_PRICE_IDS.PROFIT_RHINO,
			quantity: 1,
		});
	}

	return items;
}

/**
 * Build Stripe line items for one-time charges
 *
 * Creates line items array for one-time charges (porting, setup fees)
 * that should be invoiced immediately, separate from the subscription.
 *
 * @param selections - Contractor's onboarding selections
 * @returns Array of Stripe line items for one-time charges
 *
 * @example
 * const selections = {
 *   phonePortingCount: 1,
 *   newPhoneNumberCount: 1,
 *   gmailWorkspaceUsers: 0,
 *   profitRhinoEnabled: false
 * };
 *
 * const lineItems = buildOneTimeChargesLineItems(selections);
 * // Returns:
 * // [
 * //   { price: 'price_porting', quantity: 1 },
 * //   { price: 'price_phone_setup', quantity: 1 }
 * // ]
 */
export function buildOneTimeChargesLineItems(
	selections: OnboardingBillingSelections,
): StripeSubscriptionItem[] {
	const lineItems: StripeSubscriptionItem[] = [];

	// Phone porting fees
	if (selections.phonePortingCount > 0) {
		lineItems.push({
			price: STRIPE_PRICE_IDS.PHONE_PORTING,
			quantity: selections.phonePortingCount,
		});
	}

	// New phone number setup fees
	if (selections.newPhoneNumberCount > 0) {
		lineItems.push({
			price: STRIPE_PRICE_IDS.PHONE_NEW_NUMBER_SETUP,
			quantity: selections.newPhoneNumberCount,
		});
	}

	return lineItems;
}

/**
 * Format cost as USD currency string
 *
 * @param amount - Amount in dollars
 * @returns Formatted string (e.g., "$123.45")
 *
 * @example
 * formatCurrency(123.45); // "$123.45"
 * formatCurrency(0); // "$0.00"
 * formatCurrency(1234.5); // "$1,234.50"
 */
export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
}

/**
 * Validate that all required Stripe price IDs are configured
 *
 * Checks environment variables to ensure all necessary Stripe prices
 * are set before attempting to create checkout sessions.
 *
 * @returns Object with validation result and missing price IDs
 *
 * @example
 * const validation = validateStripePriceIds();
 * if (!validation.isValid) {
 *   console.error('Missing price IDs:', validation.missing);
 * }
 */
export function validateStripePriceIds(): {
	isValid: boolean;
	missing: string[];
} {
	const missing: string[] = [];

	if (!STRIPE_PRICE_IDS.PHONE_PORTING)
		missing.push("STRIPE_PRICE_ID_PHONE_PORTING");
	if (!STRIPE_PRICE_IDS.PHONE_NEW_NUMBER_SETUP)
		missing.push("STRIPE_PRICE_ID_PHONE_NEW_NUMBER_SETUP");
	if (!STRIPE_PRICE_IDS.BASE_PLAN) missing.push("STRIPE_PRICE_ID_BASE_PLAN");
	if (!STRIPE_PRICE_IDS.PHONE_NEW_NUMBER_MONTHLY)
		missing.push("STRIPE_PRICE_ID_PHONE_NEW_NUMBER_MONTHLY");
	if (!STRIPE_PRICE_IDS.GMAIL_WORKSPACE_PER_USER)
		missing.push("STRIPE_PRICE_ID_GMAIL_WORKSPACE_PER_USER");
	if (!STRIPE_PRICE_IDS.PROFIT_RHINO)
		missing.push("STRIPE_PRICE_ID_PROFIT_RHINO");

	return {
		isValid: missing.length === 0,
		missing,
	};
}
