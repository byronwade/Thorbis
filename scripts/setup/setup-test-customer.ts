/**
 * Setup Test Customer for Bulk Email Testing
 *
 * This script:
 * 1. Finds or creates Byron Wade customer with email bcw1995@gmail.com
 * 2. Links 10 test invoices to this customer
 * 3. Verifies the setup
 *
 * Usage: npx tsx scripts/setup/setup-test-customer.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!(supabaseUrl && supabaseKey)) {
  console.error("❌ Missing environment variables!");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const CENTS_IN_DOLLAR = 100;
const CURRENCY_DECIMALS = 2;

type CompanyRecord = { id: string; name: string };
type CustomerRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};
type InvoiceRecord = {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  sent_at: string | null;
};

async function setupTestCustomer() {
  console.log("🚀 Setting up test customer for bulk email testing...\n");

  try {
    const company = await getPrimaryCompany();
    console.log(`✅ Using company: ${company.name} (${company.id})\n`);

    const customerId = await ensureTestCustomer(company.id);
    await linkInvoicesToCustomer(customerId);
    await verifyCustomerInvoices(customerId);
    printTestingInstructions();
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function getPrimaryCompany(): Promise<CompanyRecord> {
  const { data, error } = await supabase
    .from<CompanyRecord>("companies")
    .select("id, name")
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error("No companies found. Please create a company first.");
  }

  return data;
}

async function ensureTestCustomer(companyId: string): Promise<string> {
  const TEST_EMAIL = "bcw1995@gmail.com";
  const { data: existingCustomer } = await supabase
    .from<CustomerRecord>("customers")
    .select("id, first_name, last_name, email")
    .eq("email", TEST_EMAIL)
    .maybeSingle();

  if (existingCustomer) {
    console.log(
      `✅ Found existing customer: ${existingCustomer.first_name} ${existingCustomer.last_name}`
    );
    console.log(`   Email: ${existingCustomer.email}`);
    console.log(`   ID: ${existingCustomer.id}\n`);

    await supabase
      .from("customers")
      .update({
        first_name: "Byron",
        last_name: "Wade",
        display_name: "Byron Wade",
        email: TEST_EMAIL,
        status: "active",
      })
      .eq("id", existingCustomer.id);

    return existingCustomer.id;
  }

  const { data: newCustomer, error } = await supabase
    .from<CustomerRecord>("customers")
    .insert({
      company_id: companyId,
      first_name: "Byron",
      last_name: "Wade",
      display_name: "Byron Wade",
      email: TEST_EMAIL,
      phone: "+1-555-0123",
      status: "active",
    })
    .select()
    .single();

  if (error || !newCustomer) {
    throw new Error(`Failed to create customer: ${error?.message}`);
  }

  console.log("✅ Created new customer: Byron Wade");
  console.log("   Email: bcw1995@gmail.com");
  console.log(`   ID: ${newCustomer.id}\n`);

  return newCustomer.id;
}

async function linkInvoicesToCustomer(customerId: string) {
  console.log("📧 Linking invoices to test customer...");

  const { data: invoicesToLink } = await supabase
    .from<InvoiceRecord>("invoices")
    .select("id, invoice_number, status, total_amount")
    .is("deleted_at", null)
    .is("archived_at", null)
    .in("status", ["draft", "pending"])
    .limit(10);

  if (!invoicesToLink || invoicesToLink.length === 0) {
    console.log("⚠️  No draft/pending invoices found to link");
    console.log("   Create some test invoices first\n");
    return;
  }

  const invoiceIds = invoicesToLink.map((inv) => inv.id);
  const { error: updateError } = await supabase
    .from("invoices")
    .update({ customer_id: customerId })
    .in("id", invoiceIds);

  if (updateError) {
    console.error(`❌ Failed to link invoices: ${updateError.message}`);
    return;
  }

  console.log(`✅ Linked ${invoicesToLink.length} invoices to Byron Wade\n`);
  console.log("📋 Linked Invoices:");
  for (const invoice of invoicesToLink) {
    console.log(
      `   - ${invoice.invoice_number} | ${invoice.status} | $${formatCurrency(invoice.total_amount)}`
    );
  }
  console.log("");
}

async function verifyCustomerInvoices(customerId: string) {
  console.log("🔍 Verifying setup...");

  const { data: linkedInvoices, count } = await supabase
    .from<InvoiceRecord>("invoices")
    .select("id, invoice_number, status, total_amount, sent_at", {
      count: "exact",
    })
    .eq("customer_id", customerId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(10);

  console.log(`✅ Total invoices for Byron Wade: ${count ?? 0}\n`);

  if (!linkedInvoices || linkedInvoices.length === 0) {
    return;
  }

  console.log("📋 Current Invoices (most recent):");
  for (const invoice of linkedInvoices) {
    const status = invoice.sent_at
      ? `${invoice.status} (sent)`
      : invoice.status;
    console.log(
      `   - ${invoice.invoice_number} | ${status} | $${formatCurrency(invoice.total_amount)}`
    );
  }
  console.log("");
}

function printTestingInstructions() {
  console.log("✨ Setup complete! Ready to test bulk email send.\n");
  console.log("📝 Next Steps:");
  console.log(
    "   1. Navigate to: http://localhost:3000/dashboard/work/invoices"
  );
  console.log("   2. Search for: Byron Wade");
  console.log("   3. Select 2-3 invoices");
  console.log("   4. Click the 'Send' button in bulk actions");
  console.log("   5. Confirm in the dialog");
  console.log("   6. Watch for success message\n");
  console.log("📧 Test emails will be sent to: bcw1995@gmail.com\n");
  console.log(
    "💡 In development mode, emails are logged to console instead of sent"
  );
  console.log("   Check your terminal for '[DEV MODE]' messages\n");
}

function formatCurrency(amountInCents: number) {
  return (amountInCents / CENTS_IN_DOLLAR).toFixed(CURRENCY_DECIMALS);
}

setupTestCustomer();
