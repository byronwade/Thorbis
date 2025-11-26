/**
 * Data Source Definitions for Custom Reporting
 *
 * Complete database schema documentation with detailed tooltips,
 * metric explanations, and relationship mappings.
 */

// =============================================================================
// DATA SOURCE TYPES
// =============================================================================

export interface DataSourceField {
	id: string;
	name: string;
	dbColumn: string;
	type:
		| "string"
		| "number"
		| "currency"
		| "percentage"
		| "date"
		| "boolean"
		| "duration"
		| "rating";
	description: string;
	tooltip: string;
	formula?: string;
	aggregations?: AggregationType[];
	format?: string;
	category: "dimension" | "metric" | "attribute";
	businessImpact?: "high" | "medium" | "low";
	relatedFields?: string[];
}

export interface DataSource {
	id: string;
	name: string;
	dbTable: string;
	description: string;
	tooltip: string;
	icon: string;
	color: string;
	category: DataSourceCategory;
	fields: DataSourceField[];
	relationships: DataSourceRelationship[];
	commonFilters: CommonFilter[];
	sampleQueries: SampleQuery[];
}

export interface DataSourceRelationship {
	targetSource: string;
	type: "one-to-one" | "one-to-many" | "many-to-many";
	foreignKey: string;
	description: string;
}

export interface CommonFilter {
	id: string;
	name: string;
	field: string;
	operator: FilterOperator;
	description: string;
}

export interface SampleQuery {
	name: string;
	description: string;
	metrics: string[];
	dimensions: string[];
	filters?: string[];
}

export type DataSourceCategory =
	| "financial"
	| "operations"
	| "customers"
	| "team"
	| "inventory"
	| "communications";
export type AggregationType =
	| "sum"
	| "avg"
	| "count"
	| "min"
	| "max"
	| "median"
	| "stddev";
export type FilterOperator =
	| "equals"
	| "not_equals"
	| "greater_than"
	| "less_than"
	| "between"
	| "contains"
	| "starts_with"
	| "in"
	| "is_null"
	| "is_not_null";

// =============================================================================
// FINANCIAL DATA SOURCES
// =============================================================================

export const invoicesDataSource: DataSource = {
	id: "invoices",
	name: "Invoices",
	dbTable: "invoices",
	description: "All customer invoices including draft, sent, paid, and overdue",
	tooltip:
		"Track billing performance, payment collection, and revenue recognition. Invoices are the primary source for revenue metrics and cash flow analysis.",
	icon: "Receipt",
	color: "emerald",
	category: "financial",
	fields: [
		{
			id: "total_amount",
			name: "Total Amount",
			dbColumn: "total",
			type: "currency",
			description: "Invoice total including all line items, taxes, and fees",
			tooltip:
				"The complete invoice amount before any payments or credits. This is the gross revenue expected from the invoice. Use this for revenue forecasting and sales performance tracking.",
			aggregations: ["sum", "avg", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "subtotal",
			name: "Subtotal",
			dbColumn: "subtotal",
			type: "currency",
			description: "Sum of line items before taxes and discounts",
			tooltip:
				"The base price of all services and products before any modifications. Useful for understanding true service value separate from taxes and adjustments.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "tax_amount",
			name: "Tax Amount",
			dbColumn: "tax_amount",
			type: "currency",
			description: "Total taxes applied to the invoice",
			tooltip:
				"All applicable taxes (sales tax, VAT, etc.). Track this for tax reporting and compliance. High tax amounts may indicate certain service types or geographic regions.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "discount_amount",
			name: "Discount Amount",
			dbColumn: "discount_amount",
			type: "currency",
			description: "Total discounts applied",
			tooltip:
				"All discounts given on this invoice. Monitor discount trends to ensure profitability. Excessive discounting may indicate pricing issues or sales concerns.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
			relatedFields: ["discount_percent", "discount_reason"],
		},
		{
			id: "amount_paid",
			name: "Amount Paid",
			dbColumn: "amount_paid",
			type: "currency",
			description: "Total payments received against this invoice",
			tooltip:
				"Actual cash collected. The difference between total and amount_paid is your outstanding receivable. Critical for cash flow management.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "balance_due",
			name: "Balance Due",
			dbColumn: "balance_due",
			type: "currency",
			description: "Remaining amount to be collected",
			tooltip:
				"Outstanding balance = Total - Amount Paid. High balances indicate collection issues. Track by age to prioritize collection efforts.",
			formula: "total - amount_paid",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "status",
			name: "Status",
			dbColumn: "status",
			type: "string",
			description: "Current invoice status",
			tooltip:
				"Invoice lifecycle stage: draft (not sent), sent (awaiting payment), partial (some payment received), paid (fully collected), overdue (past due date), void (cancelled). Use for pipeline analysis.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "invoice_date",
			name: "Invoice Date",
			dbColumn: "invoice_date",
			type: "date",
			description: "Date the invoice was created",
			tooltip:
				"When the invoice was generated. Use for revenue recognition timing, seasonal analysis, and billing cycle optimization.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "due_date",
			name: "Due Date",
			dbColumn: "due_date",
			type: "date",
			description: "Payment due date",
			tooltip:
				"When payment is expected. Calculate days_overdue as today - due_date for aging analysis. Longer payment terms may affect cash flow.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "paid_date",
			name: "Paid Date",
			dbColumn: "paid_date",
			type: "date",
			description: "Date payment was received",
			tooltip:
				"When the invoice was fully paid. Use paid_date - invoice_date to calculate Days Sales Outstanding (DSO). Faster payment = better cash flow.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "days_to_pay",
			name: "Days to Pay",
			dbColumn: "days_to_pay",
			type: "number",
			description: "Number of days from invoice to payment",
			tooltip:
				"Measures payment speed. Lower is better. Industry average is 30-45 days. High values may indicate customer cash flow issues or billing disputes.",
			aggregations: ["avg", "median", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "payment_method",
			name: "Payment Method",
			dbColumn: "payment_method",
			type: "string",
			description: "How the invoice was paid",
			tooltip:
				"Card, ACH, check, cash, financing. Different methods have different processing costs and timing. Cards: fast but ~3% fees. ACH: slower but cheaper. Checks: slowest, risk of bounce.",
			category: "dimension",
			businessImpact: "medium",
		},
	],
	relationships: [
		{
			targetSource: "customers",
			type: "many-to-many",
			foreignKey: "customer_id",
			description: "Invoices belong to customers",
		},
		{
			targetSource: "jobs",
			type: "many-to-many",
			foreignKey: "job_id",
			description: "Invoices are generated from jobs",
		},
		{
			targetSource: "payments",
			type: "one-to-many",
			foreignKey: "invoice_id",
			description: "Invoices can have multiple payments",
		},
	],
	commonFilters: [
		{
			id: "status_open",
			name: "Open Invoices",
			field: "status",
			operator: "in",
			description: "Invoices awaiting payment (sent, partial, overdue)",
		},
		{
			id: "status_paid",
			name: "Paid Invoices",
			field: "status",
			operator: "equals",
			description: "Fully paid invoices only",
		},
		{
			id: "overdue",
			name: "Overdue",
			field: "due_date",
			operator: "less_than",
			description: "Past due date and not fully paid",
		},
	],
	sampleQueries: [
		{
			name: "Monthly Revenue",
			description: "Total invoiced revenue by month",
			metrics: ["total_amount"],
			dimensions: ["invoice_date"],
		},
		{
			name: "Collection Rate",
			description: "Percentage of invoices paid on time",
			metrics: ["amount_paid", "total_amount"],
			dimensions: ["status"],
		},
	],
};

export const paymentsDataSource: DataSource = {
	id: "payments",
	name: "Payments",
	dbTable: "payments",
	description: "All payment transactions received",
	tooltip:
		"Track cash inflows, payment methods, and transaction success rates. Essential for cash flow management and reconciliation.",
	icon: "CreditCard",
	color: "green",
	category: "financial",
	fields: [
		{
			id: "amount",
			name: "Amount",
			dbColumn: "amount",
			type: "currency",
			description: "Payment amount received",
			tooltip:
				"The actual cash received. Note: This is stored in cents (multiply display by 100 for database queries). Track by payment method to optimize processing costs.",
			aggregations: ["sum", "avg", "min", "max", "count"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "payment_method",
			name: "Payment Method",
			dbColumn: "payment_method",
			type: "string",
			description: "How payment was made",
			tooltip:
				"Credit card, debit card, ACH, check, cash, or financing. Each has different costs: Cards ~2.9%, ACH ~0.5%, Check/Cash ~0%. Optimize mix to reduce fees.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "status",
			name: "Status",
			dbColumn: "status",
			type: "string",
			description: "Transaction status",
			tooltip:
				"pending (processing), succeeded (confirmed), failed (declined), refunded (returned to customer). Monitor failed rates to identify card/bank issues.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "processing_fee",
			name: "Processing Fee",
			dbColumn: "processing_fee",
			type: "currency",
			description: "Payment processor fees",
			tooltip:
				"Fees charged by payment processors (Stripe, Square, etc.). Track this to understand true net revenue. Typically 2.9% + $0.30 for cards.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "net_amount",
			name: "Net Amount",
			dbColumn: "net_amount",
			type: "currency",
			description: "Amount after fees",
			tooltip:
				"What you actually receive after processor fees. Net Amount = Amount - Processing Fee. This is your true cash intake.",
			formula: "amount - processing_fee",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "payment_date",
			name: "Payment Date",
			dbColumn: "payment_date",
			type: "date",
			description: "When payment was received",
			tooltip:
				"Transaction timestamp. Note: Cards process instantly but settle in 2-3 days. ACH takes 3-5 business days. Use for cash flow forecasting.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "refund_amount",
			name: "Refund Amount",
			dbColumn: "refund_amount",
			type: "currency",
			description: "Amount refunded to customer",
			tooltip:
				"Money returned. High refund rates may indicate quality issues or customer dissatisfaction. Monitor refund reasons to identify patterns.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
	],
	relationships: [
		{
			targetSource: "invoices",
			type: "many-to-many",
			foreignKey: "invoice_id",
			description: "Payments apply to invoices",
		},
		{
			targetSource: "customers",
			type: "many-to-many",
			foreignKey: "customer_id",
			description: "Payments come from customers",
		},
	],
	commonFilters: [
		{
			id: "successful",
			name: "Successful Payments",
			field: "status",
			operator: "equals",
			description: "Only confirmed payments",
		},
		{
			id: "refunded",
			name: "Refunded",
			field: "status",
			operator: "equals",
			description: "Payments that were refunded",
		},
	],
	sampleQueries: [
		{
			name: "Daily Cash Flow",
			description: "Net payments by day",
			metrics: ["net_amount"],
			dimensions: ["payment_date"],
		},
		{
			name: "Payment Method Mix",
			description: "Revenue breakdown by payment type",
			metrics: ["amount"],
			dimensions: ["payment_method"],
		},
	],
};

// =============================================================================
// OPERATIONS DATA SOURCES
// =============================================================================

export const jobsDataSource: DataSource = {
	id: "jobs",
	name: "Jobs",
	dbTable: "jobs",
	description: "Service jobs and work orders",
	tooltip:
		"The core operational unit. Jobs track all service work from scheduling to completion. Critical for operational efficiency, resource utilization, and revenue generation.",
	icon: "Briefcase",
	color: "blue",
	category: "operations",
	fields: [
		{
			id: "status",
			name: "Status",
			dbColumn: "status",
			type: "string",
			description: "Current job status",
			tooltip:
				"Job lifecycle: draft → scheduled → in_progress → completed → invoiced. Track status transitions for operational efficiency. Jobs stuck in one status may indicate process issues.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "job_type",
			name: "Job Type",
			dbColumn: "job_type",
			type: "string",
			description: "Category of service",
			tooltip:
				"Service category (repair, maintenance, installation, inspection, emergency). Different types have different margins and resource requirements. Track profitability by type.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "priority",
			name: "Priority",
			dbColumn: "priority",
			type: "string",
			description: "Job urgency level",
			tooltip:
				"low, normal, high, emergency. Higher priority jobs often command premium pricing. Track priority distribution to optimize scheduling and staffing.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "total_amount",
			name: "Total Amount",
			dbColumn: "total",
			type: "currency",
			description: "Total job revenue",
			tooltip:
				"Complete job value including labor, parts, and fees. This is potential revenue - actual collection depends on invoicing and payment. Track vs. estimates for accuracy.",
			aggregations: ["sum", "avg", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "labor_cost",
			name: "Labor Cost",
			dbColumn: "labor_cost",
			type: "currency",
			description: "Cost of technician time",
			tooltip:
				"Total labor expense = hours × hourly rate. Compare to labor_revenue to understand labor margin. Target 50-60% labor margin for healthy profitability.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "parts_cost",
			name: "Parts Cost",
			dbColumn: "parts_cost",
			type: "currency",
			description: "Cost of materials used",
			tooltip:
				"Inventory and parts expense. Track markup (parts_revenue / parts_cost) to ensure healthy margins. Industry standard is 40-100% markup on parts.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "gross_profit",
			name: "Gross Profit",
			dbColumn: "gross_profit",
			type: "currency",
			description: "Revenue minus direct costs",
			tooltip:
				"Gross Profit = Total - Labor Cost - Parts Cost. This is your contribution margin before overhead. Target 40-50% gross margin for sustainable business.",
			formula: "total - labor_cost - parts_cost",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "gross_margin",
			name: "Gross Margin %",
			dbColumn: "gross_margin_percent",
			type: "percentage",
			description: "Profit as percentage of revenue",
			tooltip:
				"Gross Margin = (Gross Profit / Total) × 100. Higher is better. Below 30% may indicate pricing or cost issues. Track by job type to identify profitable services.",
			formula: "(gross_profit / total) * 100",
			aggregations: ["avg", "median"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "scheduled_start",
			name: "Scheduled Start",
			dbColumn: "scheduled_start",
			type: "date",
			description: "When job is scheduled to begin",
			tooltip:
				"Planned start time. Compare to actual_start for schedule adherence. Large gaps indicate dispatch inefficiency or customer-caused delays.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "actual_start",
			name: "Actual Start",
			dbColumn: "actual_start",
			type: "date",
			description: "When job actually started",
			tooltip:
				"Real start time. Actual vs Scheduled variance measures operational efficiency. Target < 15 min variance for good customer experience.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "completed_at",
			name: "Completed At",
			dbColumn: "completed_at",
			type: "date",
			description: "When job was finished",
			tooltip:
				"Completion timestamp. Use for cycle time analysis (completed_at - created_at) and productivity tracking (jobs per day).",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "duration_hours",
			name: "Duration (Hours)",
			dbColumn: "duration_hours",
			type: "duration",
			description: "Total time spent on job",
			tooltip:
				"Actual hours worked. Compare to estimated_hours for accuracy. Consistently over-running estimates indicates poor scoping or training needs.",
			aggregations: ["sum", "avg", "median"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "estimated_hours",
			name: "Estimated Hours",
			dbColumn: "estimated_hours",
			type: "duration",
			description: "Planned job duration",
			tooltip:
				"Expected hours at scheduling. Accuracy affects scheduling density and customer expectations. Track by job type to improve future estimates.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "first_time_fix",
			name: "First Time Fix",
			dbColumn: "first_time_fix",
			type: "boolean",
			description: "Was job completed on first visit?",
			tooltip:
				"TRUE if resolved without return visit. Industry benchmark is 85-90% FTF rate. Low rates indicate parts availability, diagnosis, or training issues. Huge impact on profitability.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "callback_required",
			name: "Callback Required",
			dbColumn: "callback_required",
			type: "boolean",
			description: "Did job require a return visit?",
			tooltip:
				"TRUE if technician had to return. Callbacks are expensive - typically cost 2x the original job. Track by technician and job type to identify issues.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "customer_rating",
			name: "Customer Rating",
			dbColumn: "customer_rating",
			type: "rating",
			description: "Customer satisfaction score",
			tooltip:
				"1-5 star rating from customer. Average should be 4.5+. Below 4.0 indicates service issues. Low ratings correlate with churn - address immediately.",
			aggregations: ["avg", "count"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "lead_source",
			name: "Lead Source",
			dbColumn: "source",
			type: "string",
			description: "How customer found you",
			tooltip:
				"Marketing attribution: referral, google, facebook, repeat, etc. Track revenue by source to optimize marketing spend. Referrals typically have highest conversion and LTV.",
			category: "dimension",
			businessImpact: "high",
		},
	],
	relationships: [
		{
			targetSource: "customers",
			type: "many-to-many",
			foreignKey: "customer_id",
			description: "Jobs are performed for customers",
		},
		{
			targetSource: "team_members",
			type: "many-to-many",
			foreignKey: "assigned_to",
			description: "Jobs are assigned to technicians",
		},
		{
			targetSource: "invoices",
			type: "one-to-many",
			foreignKey: "job_id",
			description: "Jobs generate invoices",
		},
		{
			targetSource: "estimates",
			type: "one-to-many",
			foreignKey: "job_id",
			description: "Jobs may have estimates",
		},
		{
			targetSource: "equipment",
			type: "many-to-many",
			foreignKey: "equipment_id",
			description: "Jobs service equipment",
		},
	],
	commonFilters: [
		{
			id: "completed",
			name: "Completed Jobs",
			field: "status",
			operator: "equals",
			description: "Only finished jobs",
		},
		{
			id: "in_progress",
			name: "In Progress",
			field: "status",
			operator: "equals",
			description: "Currently active jobs",
		},
		{
			id: "emergency",
			name: "Emergency Jobs",
			field: "priority",
			operator: "equals",
			description: "High priority emergency calls",
		},
	],
	sampleQueries: [
		{
			name: "Revenue by Job Type",
			description: "Total revenue broken down by service category",
			metrics: ["total_amount", "gross_profit"],
			dimensions: ["job_type"],
		},
		{
			name: "Technician Productivity",
			description: "Jobs completed and revenue per technician",
			metrics: ["total_amount", "duration_hours"],
			dimensions: ["assigned_to"],
		},
		{
			name: "First Time Fix Rate",
			description: "Percentage of jobs completed on first visit",
			metrics: ["first_time_fix"],
			dimensions: ["job_type", "assigned_to"],
		},
	],
};

export const estimatesDataSource: DataSource = {
	id: "estimates",
	name: "Estimates",
	dbTable: "estimates",
	description: "Quotes and proposals sent to customers",
	tooltip:
		"Track your sales pipeline. Estimates represent potential revenue. Monitor conversion rates, average values, and time-to-close to optimize your sales process.",
	icon: "FileText",
	color: "amber",
	category: "operations",
	fields: [
		{
			id: "total_amount",
			name: "Total Amount",
			dbColumn: "total",
			type: "currency",
			description: "Estimate total value",
			tooltip:
				"Proposed job value. This is your potential revenue pipeline. Track total estimates value to forecast future revenue. Compare to actual job values to measure estimate accuracy.",
			aggregations: ["sum", "avg", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "status",
			name: "Status",
			dbColumn: "status",
			type: "string",
			description: "Estimate lifecycle stage",
			tooltip:
				"draft (not sent), sent (awaiting response), viewed (customer opened), accepted (converted to job), declined (lost), expired (past valid date). Pipeline stage for forecasting.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "conversion_probability",
			name: "Conversion Probability",
			dbColumn: "conversion_probability",
			type: "percentage",
			description: "Likelihood of winning this estimate",
			tooltip:
				"AI-predicted win probability based on historical data. Use for weighted pipeline forecasting: Expected Revenue = Total × Probability. Higher values indicate better qualified opportunities.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "created_at",
			name: "Created At",
			dbColumn: "created_at",
			type: "date",
			description: "When estimate was created",
			tooltip:
				"Creation timestamp. Track estimate volume over time. Sudden drops may indicate lead generation issues. Spikes may strain your capacity to follow up.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "sent_at",
			name: "Sent At",
			dbColumn: "sent_at",
			type: "date",
			description: "When estimate was sent to customer",
			tooltip:
				"Delivery timestamp. Time from creation to send should be < 24 hours for best conversion. Delays hurt win rates.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "viewed_at",
			name: "Viewed At",
			dbColumn: "viewed_at",
			type: "date",
			description: "When customer first viewed",
			tooltip:
				"Customer engagement signal. Quick views indicate interest. No view after 48 hours suggests the estimate may be in spam or customer is not engaged.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "accepted_at",
			name: "Accepted At",
			dbColumn: "accepted_at",
			type: "date",
			description: "When estimate was approved",
			tooltip:
				"Conversion timestamp. Days from sent to accepted is your sales cycle length. Shorter cycles = healthier pipeline. Long cycles may need follow-up automation.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "expiry_date",
			name: "Expiry Date",
			dbColumn: "valid_until",
			type: "date",
			description: "When estimate expires",
			tooltip:
				"Deadline for customer decision. Expired estimates should be followed up or closed. Short validity (7-14 days) creates urgency. Long validity (30+ days) may delay decisions.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "days_to_convert",
			name: "Days to Convert",
			dbColumn: "days_to_convert",
			type: "number",
			description: "Time from sent to accepted",
			tooltip:
				"Sales cycle length. Industry average is 7-14 days. Longer cycles tie up resources and reduce forecast accuracy. Track by estimate size - larger deals typically take longer.",
			aggregations: ["avg", "median", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "follow_up_count",
			name: "Follow-up Count",
			dbColumn: "follow_up_count",
			type: "number",
			description: "Number of follow-up attempts",
			tooltip:
				"How many times you've followed up. Sweet spot is 2-5 follow-ups. Zero follow-ups hurt conversion. Too many (10+) wastes resources on unqualified leads.",
			aggregations: ["avg", "sum"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "decline_reason",
			name: "Decline Reason",
			dbColumn: "decline_reason",
			type: "string",
			description: "Why estimate was rejected",
			tooltip:
				"Categories: price (too expensive), timing (not ready), competitor (chose another), diy (doing themselves), other. Track to identify patterns and improve win rate.",
			category: "dimension",
			businessImpact: "high",
		},
	],
	relationships: [
		{
			targetSource: "customers",
			type: "many-to-many",
			foreignKey: "customer_id",
			description: "Estimates are for customers",
		},
		{
			targetSource: "jobs",
			type: "one-to-many",
			foreignKey: "estimate_id",
			description: "Accepted estimates become jobs",
		},
	],
	commonFilters: [
		{
			id: "pending",
			name: "Pending Response",
			field: "status",
			operator: "in",
			description: "Estimates awaiting customer decision",
		},
		{
			id: "won",
			name: "Won Estimates",
			field: "status",
			operator: "equals",
			description: "Converted to jobs",
		},
		{
			id: "lost",
			name: "Lost Estimates",
			field: "status",
			operator: "equals",
			description: "Declined or expired",
		},
	],
	sampleQueries: [
		{
			name: "Conversion Funnel",
			description: "Estimates by stage with conversion rates",
			metrics: ["total_amount"],
			dimensions: ["status"],
		},
		{
			name: "Win/Loss Analysis",
			description: "Declined estimates by reason",
			metrics: ["total_amount"],
			dimensions: ["decline_reason"],
			filters: ["lost"],
		},
	],
};

// =============================================================================
// CUSTOMER DATA SOURCES
// =============================================================================

export const customersDataSource: DataSource = {
	id: "customers",
	name: "Customers",
	dbTable: "customers",
	description: "All customer records and profiles",
	tooltip:
		"Your customer base is your most valuable asset. Track customer health, lifetime value, and engagement to maximize retention and growth.",
	icon: "Users",
	color: "purple",
	category: "customers",
	fields: [
		{
			id: "lifetime_value",
			name: "Lifetime Value",
			dbColumn: "lifetime_value",
			type: "currency",
			description: "Total revenue from this customer",
			tooltip:
				"All-time revenue generated. LTV = Sum of all invoices paid. High LTV customers deserve VIP treatment. Track LTV growth over time to measure customer development success.",
			aggregations: ["sum", "avg", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "total_revenue",
			name: "Total Revenue",
			dbColumn: "total_revenue",
			type: "currency",
			description: "Sum of all customer invoices",
			tooltip:
				"Total billed amount. May differ from lifetime_value due to outstanding balances or refunds. Use for revenue analysis.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "outstanding_balance",
			name: "Outstanding Balance",
			dbColumn: "outstanding_balance",
			type: "currency",
			description: "Amount currently owed",
			tooltip:
				"Unpaid invoice total. High balances may indicate payment issues. Consider before offering new services. Important for credit management.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "total_jobs",
			name: "Total Jobs",
			dbColumn: "total_jobs",
			type: "number",
			description: "Number of completed jobs",
			tooltip:
				"Service frequency indicator. More jobs = more engaged customer. Zero jobs after estimate may indicate lost opportunity.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "average_job_value",
			name: "Average Job Value",
			dbColumn: "average_job_value",
			type: "currency",
			description: "Mean revenue per job",
			tooltip:
				"Average ticket size. Track over time - declining AJV may indicate downselling or competition. Rising AJV suggests successful upselling.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "customer_segment",
			name: "Segment",
			dbColumn: "customer_segment",
			type: "string",
			description: "Customer classification",
			tooltip:
				"Behavioral segment: new (< 90 days), active (recent service), loyal (multiple services), at_risk (overdue for service), dormant (no activity 1+ year), churned (lost), vip (top 10% LTV).",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "health_score",
			name: "Health Score",
			dbColumn: "health_score",
			type: "number",
			description: "Customer engagement score (0-100)",
			tooltip:
				"Composite score based on: recency (last service), frequency (job count), monetary (LTV), satisfaction (ratings), and balance (payment behavior). Above 70 = healthy, below 40 = at risk.",
			aggregations: ["avg", "min", "max"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "churn_risk",
			name: "Churn Risk",
			dbColumn: "churn_risk",
			type: "string",
			description: "Likelihood of losing customer",
			tooltip:
				"AI-predicted risk: low (< 20%), medium (20-50%), high (> 50%), churned (lost). Prioritize retention efforts on high-risk valuable customers.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "last_job_date",
			name: "Last Service Date",
			dbColumn: "last_job_date",
			type: "date",
			description: "Most recent service",
			tooltip:
				"Recency indicator. Customers with no service in 12+ months are dormant. Schedule proactive outreach based on typical service intervals.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "created_at",
			name: "Customer Since",
			dbColumn: "created_at",
			type: "date",
			description: "Account creation date",
			tooltip:
				"Customer tenure. Longer tenure typically means higher LTV. Track new customer acquisition rate monthly.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "source",
			name: "Acquisition Source",
			dbColumn: "source",
			type: "string",
			description: "How customer found you",
			tooltip:
				"Lead source: referral, google, facebook, yelp, repeat, direct, etc. Track LTV by source to optimize marketing spend. Referrals typically have 25-50% higher LTV.",
			category: "dimension",
			businessImpact: "high",
		},
		{
			id: "type",
			name: "Customer Type",
			dbColumn: "type",
			type: "string",
			description: "Residential or commercial",
			tooltip:
				"Business classification. Commercial customers typically have higher AJV but longer payment cycles. Residential is higher volume, faster payment.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "average_satisfaction",
			name: "Average Satisfaction",
			dbColumn: "average_satisfaction_rating",
			type: "rating",
			description: "Mean customer rating",
			tooltip:
				"Average of all job ratings. Below 4.0 indicates relationship issues. Track trend over time - declining satisfaction predicts churn.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "nps_score",
			name: "NPS Score",
			dbColumn: "nps_score",
			type: "number",
			description: "Net Promoter Score",
			tooltip:
				"Would they recommend you? -100 to +100 scale. Promoters (9-10), Passives (7-8), Detractors (0-6). Score > 50 is excellent. Industry average is 30-40.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "equipment_count",
			name: "Equipment Count",
			dbColumn: "equipment_count",
			type: "number",
			description: "Number of units on file",
			tooltip:
				"More equipment = more service opportunities. Cross-sell maintenance plans. Equipment data enables proactive outreach when units age out.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "active_contract_value",
			name: "Contract Value",
			dbColumn: "active_contract_value",
			type: "currency",
			description: "Value of active service agreements",
			tooltip:
				"Recurring revenue from this customer. Contract customers have 3-5x higher retention. Track contract penetration to grow recurring revenue.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
	],
	relationships: [
		{
			targetSource: "jobs",
			type: "one-to-many",
			foreignKey: "customer_id",
			description: "Customers have many jobs",
		},
		{
			targetSource: "invoices",
			type: "one-to-many",
			foreignKey: "customer_id",
			description: "Customers receive invoices",
		},
		{
			targetSource: "properties",
			type: "one-to-many",
			foreignKey: "customer_id",
			description: "Customers have properties",
		},
		{
			targetSource: "equipment",
			type: "one-to-many",
			foreignKey: "customer_id",
			description: "Customers own equipment",
		},
	],
	commonFilters: [
		{
			id: "active",
			name: "Active Customers",
			field: "status",
			operator: "equals",
			description: "Currently active accounts",
		},
		{
			id: "at_risk",
			name: "At Risk",
			field: "churn_risk",
			operator: "in",
			description: "High churn risk customers",
		},
		{
			id: "vip",
			name: "VIP Customers",
			field: "customer_segment",
			operator: "equals",
			description: "Top tier customers",
		},
	],
	sampleQueries: [
		{
			name: "Customer Segmentation",
			description: "Customer count and LTV by segment",
			metrics: ["lifetime_value"],
			dimensions: ["customer_segment"],
		},
		{
			name: "Acquisition Analysis",
			description: "New customers and LTV by source",
			metrics: ["lifetime_value", "total_jobs"],
			dimensions: ["source"],
		},
		{
			name: "Churn Risk Report",
			description: "At-risk customers sorted by value",
			metrics: ["lifetime_value", "health_score"],
			dimensions: ["churn_risk"],
			filters: ["at_risk"],
		},
	],
};

// =============================================================================
// TEAM DATA SOURCES
// =============================================================================

export const teamMembersDataSource: DataSource = {
	id: "team_members",
	name: "Team Members",
	dbTable: "team_members",
	description: "Employees and their performance metrics",
	tooltip:
		"Track technician productivity, efficiency, and quality. Team performance directly impacts profitability and customer satisfaction.",
	icon: "UserCheck",
	color: "indigo",
	category: "team",
	fields: [
		{
			id: "name",
			name: "Name",
			dbColumn: "display_name",
			type: "string",
			description: "Team member name",
			tooltip: "Full name for display. Use for grouping and reporting.",
			category: "dimension",
			businessImpact: "low",
		},
		{
			id: "role",
			name: "Role",
			dbColumn: "role",
			type: "string",
			description: "Job title/position",
			tooltip:
				"Position: technician, senior_tech, lead, manager, admin. Different roles have different metrics expectations. Compare within role groups.",
			category: "dimension",
			businessImpact: "medium",
		},
		{
			id: "hourly_rate",
			name: "Hourly Rate",
			dbColumn: "hourly_rate",
			type: "currency",
			description: "Pay rate per hour",
			tooltip:
				"Labor cost basis. Use to calculate job costs and margins. Higher rates should correlate with higher productivity or specialized skills.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "billable_rate",
			name: "Billable Rate",
			dbColumn: "billable_rate",
			type: "currency",
			description: "Rate charged to customers",
			tooltip:
				"What you charge for this tech's time. Billable Rate / Hourly Rate = Labor Margin. Target 2-3x multiplier for healthy margins.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "utilization_rate",
			name: "Utilization Rate",
			dbColumn: "utilization_rate",
			type: "percentage",
			description: "Percentage of time on billable work",
			tooltip:
				"Billable Hours / Available Hours × 100. Target 70-80%. Below 60% indicates scheduling issues or training needs. Above 90% risks burnout.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "jobs_completed",
			name: "Jobs Completed",
			dbColumn: "jobs_completed_count",
			type: "number",
			description: "Number of jobs finished",
			tooltip:
				"Productivity measure. Track weekly/monthly trends. Sudden drops may indicate issues. Compare to team average and historical performance.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "revenue_generated",
			name: "Revenue Generated",
			dbColumn: "revenue_generated",
			type: "currency",
			description: "Total revenue from assigned jobs",
			tooltip:
				"Value of work completed. Revenue per tech varies by experience, job mix, and territory. Use for commission calculations and performance reviews.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "average_job_value",
			name: "Average Job Value",
			dbColumn: "average_job_value",
			type: "currency",
			description: "Mean revenue per job",
			tooltip:
				"Revenue / Jobs Completed. Higher values indicate upselling success. Compare across team to identify training opportunities.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "first_time_fix_rate",
			name: "First Time Fix Rate",
			dbColumn: "first_time_fix_rate",
			type: "percentage",
			description: "Jobs completed on first visit",
			tooltip:
				"Quality indicator. Target 85-90%. Below 75% needs investigation - could be training, parts availability, or dispatch issues. Huge impact on profitability.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "callback_rate",
			name: "Callback Rate",
			dbColumn: "callback_rate",
			type: "percentage",
			description: "Jobs requiring return visit",
			tooltip:
				"Inverse of FTF. Target < 15%. High callback rates are expensive (2x cost) and damage customer satisfaction. Identify root causes.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "average_rating",
			name: "Average Rating",
			dbColumn: "average_rating",
			type: "rating",
			description: "Mean customer satisfaction score",
			tooltip:
				"Customer ratings 1-5. Target 4.5+. Below 4.0 requires immediate attention. Ratings impact customer retention and referrals.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "high",
		},
		{
			id: "avg_job_duration",
			name: "Avg Job Duration",
			dbColumn: "average_job_duration",
			type: "duration",
			description: "Average time per job",
			tooltip:
				"Mean hours per job. Lower is more efficient IF quality is maintained. Compare by job type - some naturally take longer. Track trend over time.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "on_time_arrival_rate",
			name: "On-Time Arrival",
			dbColumn: "on_time_arrival_rate",
			type: "percentage",
			description: "Percentage arriving within window",
			tooltip:
				"Punctuality measure. Target 90%+. Late arrivals hurt customer satisfaction. May indicate routing issues, poor time estimation, or traffic problems.",
			aggregations: ["avg"],
			category: "metric",
			businessImpact: "medium",
		},
		{
			id: "overtime_hours",
			name: "Overtime Hours",
			dbColumn: "overtime_hours",
			type: "duration",
			description: "Hours worked over 40/week",
			tooltip:
				"OT is 1.5x cost. Some OT is healthy (high demand), excessive OT (15%+ of hours) indicates understaffing or poor scheduling.",
			aggregations: ["sum", "avg"],
			category: "metric",
			businessImpact: "high",
		},
	],
	relationships: [
		{
			targetSource: "jobs",
			type: "one-to-many",
			foreignKey: "assigned_to",
			description: "Team members are assigned jobs",
		},
	],
	commonFilters: [
		{
			id: "technicians",
			name: "Technicians Only",
			field: "role",
			operator: "in",
			description: "Field service technicians",
		},
		{
			id: "active",
			name: "Active Employees",
			field: "status",
			operator: "equals",
			description: "Currently employed",
		},
	],
	sampleQueries: [
		{
			name: "Productivity Leaderboard",
			description: "Revenue and jobs by technician",
			metrics: ["revenue_generated", "jobs_completed"],
			dimensions: ["name"],
		},
		{
			name: "Quality Metrics",
			description: "FTF rate and ratings by technician",
			metrics: ["first_time_fix_rate", "average_rating"],
			dimensions: ["name"],
		},
		{
			name: "Efficiency Analysis",
			description: "Utilization and average job duration",
			metrics: ["utilization_rate", "avg_job_duration"],
			dimensions: ["name", "role"],
		},
	],
};

// =============================================================================
// EXPORT ALL DATA SOURCES
// =============================================================================

export const DATA_SOURCES: DataSource[] = [
	invoicesDataSource,
	paymentsDataSource,
	jobsDataSource,
	estimatesDataSource,
	customersDataSource,
	teamMembersDataSource,
];

export const DATA_SOURCES_MAP: Record<string, DataSource> = {
	invoices: invoicesDataSource,
	payments: paymentsDataSource,
	jobs: jobsDataSource,
	estimates: estimatesDataSource,
	customers: customersDataSource,
	team_members: teamMembersDataSource,
};

// Helper to get field by ID across all sources
export function getFieldById(fieldId: string): DataSourceField | undefined {
	for (const source of DATA_SOURCES) {
		const field = source.fields.find((f) => f.id === fieldId);
		if (field) return field;
	}
	return undefined;
}

// Helper to get all fields for a category
export function getFieldsByCategory(
	category: DataSourceCategory,
): DataSourceField[] {
	return DATA_SOURCES.filter((s) => s.category === category).flatMap(
		(s) => s.fields,
	);
}
