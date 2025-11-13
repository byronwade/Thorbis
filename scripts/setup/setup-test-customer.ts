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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!(supabaseUrl && supabaseKey)) {
  console.error("❌ Missing environment variables!");
  console.error(
    "Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestCustomer() {
  console.log("🚀 Setting up test customer for bulk email testing...\n");

  try {
    // Step 1: Get a company ID
    const { data: companies, error: companyError } = await supabase
      .from("companies")
      .select("id, name")
      .limit(1)
      .single();

    if (companyError || !companies) {
      throw new Error("No companies found. Please create a company first.");
    }

    console.log(`✅ Using company: ${companies.name} (${companies.id})\n`);

    // Step 2: Find or create Byron Wade customer
    let customerId: string;

    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("id, first_name, last_name, email")
      .eq("email", "bcw1995@gmail.com")
      .maybeSingle();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      console.log(
        `✅ Found existing customer: ${existingCustomer.first_name} ${existingCustomer.last_name}`
      );
      console.log(`   Email: ${existingCustomer.email}`);
      console.log(`   ID: ${customerId}\n`);

      // Update to ensure data is correct
      await supabase
        .from("customers")
        .update({
          first_name: "Byron",
          last_name: "Wade",
          display_name: "Byron Wade",
          email: "bcw1995@gmail.com",
          status: "active",
        })
        .eq("id", customerId);
    } else {
      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from("customers")
        .insert({
          company_id: companies.id,
          first_name: "Byron",
          last_name: "Wade",
          display_name: "Byron Wade",
          email: "bcw1995@gmail.com",
          phone: "+1-555-0123",
          status: "active",
        })
        .select()
        .single();

      if (createError || !newCustomer) {
        throw new Error(`Failed to create customer: ${createError?.message}`);
      }

      customerId = newCustomer.id;
      console.log("✅ Created new customer: Byron Wade");
      console.log("   Email: bcw1995@gmail.com");
      console.log(`   ID: ${customerId}\n`);
    }

    // Step 3: Link test invoices to this customer
    console.log("📧 Linking invoices to test customer...");

    // Get invoices that need a customer
    const { data: invoicesToLink } = await supabase
      .from("invoices")
      .select("id, invoice_number, status, total_amount")
      .is("deleted_at", null)
      .is("archived_at", null)
      .in("status", ["draft", "pending"])
      .limit(10);

    if (!invoicesToLink || invoicesToLink.length === 0) {
      console.log("⚠️  No draft/pending invoices found to link");
      console.log("   Create some test invoices first\n");
    } else {
      // Update invoices to link to our test customer
      const invoiceIds = invoicesToLink.map((inv) => inv.id);

      const { error: updateError } = await supabase
        .from("invoices")
        .update({ customer_id: customerId })
        .in("id", invoiceIds);

      if (updateError) {
        console.error(`❌ Failed to link invoices: ${updateError.message}`);
      } else {
        console.log(
          `✅ Linked ${invoicesToLink.length} invoices to Byron Wade\n`
        );

        // Show the linked invoices
        console.log("📋 Linked Invoices:");
        for (const invoice of invoicesToLink) {
          console.log(
            `   - ${invoice.invoice_number} | ${invoice.status} | $${(invoice.total_amount / 100).toFixed(2)}`
          );
        }
        console.log("");
      }
    }

    // Step 4: Verify setup
    console.log("🔍 Verifying setup...");

    const { data: linkedInvoices, count } = await supabase
      .from("invoices")
      .select("id, invoice_number, status, total_amount, sent_at", {
        count: "exact",
      })
      .eq("customer_id", customerId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(10);

    console.log(`✅ Total invoices for Byron Wade: ${count}\n`);

    if (linkedInvoices && linkedInvoices.length > 0) {
      console.log("📋 Current Invoices (most recent):");
      for (const invoice of linkedInvoices) {
        const status = invoice.sent_at
          ? `${invoice.status} (sent)`
          : invoice.status;
        console.log(
          `   - ${invoice.invoice_number} | ${status} | $${(invoice.total_amount / 100).toFixed(2)}`
        );
      }
      console.log("");
    }

    // Step 5: Test instructions
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
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

setupTestCustomer();
