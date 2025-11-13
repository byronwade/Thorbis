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

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

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
  const sequence = String(index).padStart(4, "0");
  return `INV-${year}${month}-${sequence}`;
}

function generatePaymentNumber(
  invoiceIndex: number,
  paymentIndex: number
): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `PAY-${year}${month}-${String(invoiceIndex).padStart(4, "0")}-${paymentIndex}`;
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
    ? Math.floor(totalAmount * (0.5 + Math.random() * 0.4)) // 50-90% paid
    : totalAmount;

  const payments: number[] = [];
  let remaining = targetAmount;

  for (let i = 0; i < numPayments - 1; i++) {
    // Random payment between 10% and 40% of remaining
    const minPayment = Math.floor(remaining * 0.1);
    const maxPayment = Math.floor(remaining * 0.4);
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
  const daysInMs = daysBack * 24 * 60 * 60 * 1000;
  const randomTime = now - Math.random() * daysInMs;
  return new Date(randomTime);
}

// ============================================================================
// Main Script
// ============================================================================

async function generateInvoicesAndPayments() {
  console.log("🚀 Starting invoice and payment generation...\n");

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!(supabaseUrl && supabaseKey)) {
    console.error("\n❌ Missing Supabase credentials!");
    console.error("\nPlease ensure your .env.local file contains:");
    console.error("  NEXT_PUBLIC_SUPABASE_URL=your-url");
    console.error("  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key");
    console.error("  (or SUPABASE_SERVICE_ROLE_KEY for admin access)\n");
    console.error("Current environment:");
    console.error(
      `  NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? "✅ Set" : "❌ Missing"}`
    );
    console.error(
      `  SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing"}`
    );
    console.error(
      `  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}\n`
    );
    throw new Error("Missing Supabase credentials in environment variables");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // =========================================================================
  // Step 1: Get company_id and customer_id
  // =========================================================================

  console.log("📋 Fetching company and customer data...");

  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("id")
    .limit(1)
    .single();

  if (companiesError || !companies) {
    throw new Error(`Failed to fetch company: ${companiesError?.message}`);
  }

  const companyId = companies.id;
  console.log(`✅ Using company: ${companyId}`);

  // Get all customers for random assignment
  const { data: customers, error: customersError } = await supabase
    .from("customers")
    .select("id")
    .limit(100);

  if (customersError || !customers || customers.length === 0) {
    throw new Error(`Failed to fetch customers: ${customersError?.message}`);
  }

  console.log(`✅ Found ${customers.length} customers\n`);

  // =========================================================================
  // Step 2: Generate Invoices
  // =========================================================================

  console.log(`📝 Generating ${TOTAL_INVOICES} invoices...`);

  const invoices = [];
  const allPayments = [];

  for (let i = 1; i <= TOTAL_INVOICES; i++) {
    // Random invoice amount
    const totalAmount = randomInt(MIN_INVOICE_AMOUNT, MAX_INVOICE_AMOUNT);
    const subtotal = Math.floor(totalAmount / 1.08); // Assume 8% tax
    const taxAmount = totalAmount - subtotal;

    // Random number of payments
    const numPayments = randomInt(
      MIN_PAYMENTS_PER_INVOICE,
      MAX_PAYMENTS_PER_INVOICE
    );

    // Decide if invoice is fully paid or partial
    const invoiceStatus = randomElement(INVOICE_STATUSES);
    const isPartialPaid = invoiceStatus === "partial";
    const isSent = invoiceStatus === "sent";

    // Split amount into payments
    const paymentAmounts = isSent
      ? [] // No payments yet
      : splitAmountIntoPayments(totalAmount, numPayments, isPartialPaid);

    const amountPaid = paymentAmounts.reduce((sum, amt) => sum + amt, 0);
    const amountDue = totalAmount - amountPaid;

    // Create invoice
    const invoice = {
      id: crypto.randomUUID(),
      company_id: companyId,
      customer_id: randomElement(customers).id,
      invoice_number: generateInvoiceNumber(i),
      title: `Service Invoice #${i}`,
      description: `Professional services rendered for project ${i}`,
      status:
        amountDue === 0
          ? "paid"
          : amountDue === totalAmount
            ? "sent"
            : "partial",
      subtotal,
      tax_rate: 8.0,
      tax_amount: taxAmount,
      discount_amount: 0,
      total_amount: totalAmount,
      amount_paid: amountPaid,
      amount_due: amountDue,
      balance_amount: amountDue,
      paid_amount: amountPaid,
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      payment_terms: "Net 30",
      line_items: [
        {
          description: "Professional Services",
          quantity: 1,
          unit_price: subtotal,
          amount: subtotal,
        },
      ],
      sent_at: randomRecentDate(60).toISOString(),
      viewed_at: randomRecentDate(50).toISOString(),
      paid_at: amountDue === 0 ? randomRecentDate(30).toISOString() : null,
      created_at: randomRecentDate(90).toISOString(),
    };

    invoices.push(invoice);

    // =========================================================================
    // Step 3: Generate Payments for this Invoice
    // =========================================================================

    for (let p = 0; p < paymentAmounts.length; p++) {
      const payment = {
        id: crypto.randomUUID(),
        company_id: companyId,
        customer_id: invoice.customer_id,
        invoice_id: invoice.id,
        payment_number: generatePaymentNumber(i, p + 1),
        reference_number: `REF-${i}-${p + 1}`,
        amount: paymentAmounts[p],
        payment_method: randomElement(PAYMENT_METHODS),
        payment_type: "payment" as const,
        status: randomElement(PAYMENT_STATUSES),
        // Add card details for credit/debit card payments
        card_brand:
          Math.random() > 0.5
            ? randomElement(["visa", "mastercard", "amex", "discover"] as const)
            : null,
        card_last4: Math.random() > 0.5 ? String(randomInt(1000, 9999)) : null,
        // Processing info
        processor_name: "stripe",
        processor_transaction_id: `txn_${crypto.randomUUID().slice(0, 24)}`,
        processor_fee: Math.floor(paymentAmounts[p] * 0.029 + 30), // 2.9% + $0.30
        net_amount:
          paymentAmounts[p] - Math.floor(paymentAmounts[p] * 0.029 + 30),
        // Receipt
        receipt_number: `RCPT-${i}-${p + 1}`,
        receipt_emailed: true,
        // Timestamps
        processed_at: randomRecentDate(30).toISOString(),
        completed_at: randomRecentDate(25).toISOString(),
        created_at: randomRecentDate(35).toISOString(),
      };

      allPayments.push(payment);
    }

    // Progress indicator
    if (i % 100 === 0) {
      console.log(`   Generated ${i}/${TOTAL_INVOICES} invoices...`);
    }
  }

  console.log(`✅ Generated ${invoices.length} invoices`);
  console.log(`✅ Generated ${allPayments.length} payments\n`);

  // =========================================================================
  // Step 4: Insert into Database
  // =========================================================================

  console.log("💾 Inserting invoices into database...");

  // Insert in batches of 100 to avoid payload size limits
  const batchSize = 100;
  let insertedInvoices = 0;

  for (let i = 0; i < invoices.length; i += batchSize) {
    const batch = invoices.slice(i, i + batchSize);

    const { error: invoiceError } = await supabase
      .from("invoices")
      .insert(batch);

    if (invoiceError) {
      console.error(
        `❌ Error inserting invoice batch ${i / batchSize + 1}:`,
        invoiceError
      );
      throw invoiceError;
    }

    insertedInvoices += batch.length;
    console.log(
      `   Inserted ${insertedInvoices}/${invoices.length} invoices...`
    );
  }

  console.log("✅ All invoices inserted\n");

  console.log("💾 Inserting payments into database...");

  let insertedPayments = 0;

  for (let i = 0; i < allPayments.length; i += batchSize) {
    const batch = allPayments.slice(i, i + batchSize);

    const { error: paymentError } = await supabase
      .from("payments")
      .insert(batch);

    if (paymentError) {
      console.error(
        `❌ Error inserting payment batch ${i / batchSize + 1}:`,
        paymentError
      );
      throw paymentError;
    }

    insertedPayments += batch.length;
    console.log(
      `   Inserted ${insertedPayments}/${allPayments.length} payments...`
    );
  }

  console.log("✅ All payments inserted\n");

  // =========================================================================
  // Step 5: Summary Statistics
  // =========================================================================

  console.log("📊 Generation Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `✅ Invoices created:        ${invoices.length.toLocaleString()}`
  );
  console.log(
    `✅ Payments created:        ${allPayments.length.toLocaleString()}`
  );
  console.log(
    `✅ Avg payments/invoice:    ${(allPayments.length / invoices.length).toFixed(1)}`
  );

  const totalInvoiceAmount = invoices.reduce(
    (sum, inv) => sum + inv.total_amount,
    0
  );
  const totalPaymentAmount = allPayments.reduce(
    (sum, pay) => sum + pay.amount,
    0
  );
  const totalAmountPaid = invoices.reduce(
    (sum, inv) => sum + inv.amount_paid,
    0
  );

  console.log(
    `💰 Total invoice amount:    $${(totalInvoiceAmount / 100).toLocaleString()}`
  );
  console.log(
    `💰 Total payments made:     $${(totalPaymentAmount / 100).toLocaleString()}`
  );
  console.log(
    `💰 Total amount paid:       $${(totalAmountPaid / 100).toLocaleString()}`
  );

  const paidInvoices = invoices.filter((inv) => inv.status === "paid").length;
  const partialInvoices = invoices.filter(
    (inv) => inv.status === "partial"
  ).length;
  const sentInvoices = invoices.filter((inv) => inv.status === "sent").length;

  console.log("\n📈 Invoice Status Breakdown:");
  console.log(
    `   Paid:        ${paidInvoices} (${((paidInvoices / invoices.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `   Partial:     ${partialInvoices} (${((partialInvoices / invoices.length) * 100).toFixed(1)}%)`
  );
  console.log(
    `   Sent:        ${sentInvoices} (${((sentInvoices / invoices.length) * 100).toFixed(1)}%)`
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
