/**
 * Admin Setup with Service Role - Bypasses RLS
 * DELETE AFTER TESTING
 */

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Get service role key from env
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!(supabaseUrl && serviceRoleKey)) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          hint: "Set SUPABASE_SERVICE_ROLE_KEY in .env.local",
        },
        { status: 500 }
      );
    }

    // Create service role client (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const userId = "f5923029-11a5-439a-b6a8-ce3b8da62716";

    // Create company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: "Test Company",
        slug: `test-company-${Date.now()}`,
        owner_id: userId,
      })
      .select()
      .single();

    if (companyError) {
      return NextResponse.json(
        { error: "Failed to create company", details: companyError },
        { status: 500 }
      );
    }

    // Create team member
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("team_members")
      .insert({
        company_id: company.id,
        user_id: userId,
        role: "admin",
        status: "active",
      })
      .select()
      .single();

    if (teamMemberError) {
      return NextResponse.json(
        { error: "Failed to create team member", details: teamMemberError },
        { status: 500 }
      );
    }

    // Create customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        company_id: company.id,
        type: "residential",
        first_name: "Byron",
        last_name: "Wade",
        email: "bcw1995@gmail.com",
        phone: "+1 (555) 123-4567",
        status: "active",
        created_by: userId,
      })
      .select()
      .single();

    if (customerError) {
      return NextResponse.json(
        { error: "Failed to create customer", details: customerError },
        { status: 500 }
      );
    }

    // Create property
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .insert({
        company_id: company.id,
        customer_id: customer.id,
        name: "Primary Residence",
        address: "165 Rock Building Lane",
        address2: null,
        city: "Talking Rock",
        state: "GA",
        zip_code: "30175",
        country: "USA",
        property_type: "residential",
        is_primary: true,
      })
      .select()
      .single();

    if (propertyError) {
      return NextResponse.json(
        { error: "Failed to create property", details: propertyError },
        { status: 500 }
      );
    }

    // Create job
    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .insert({
        company_id: company.id,
        customer_id: customer.id,
        property_id: property.id,
        title: "Test Job - Enrichment Demo",
        description:
          "This job will show operational intelligence with weather, water quality, flood zones, and nearby suppliers",
        status: "scheduled",
        priority: "medium",
        job_type: "service",
        created_by: userId,
      })
      .select()
      .single();

    if (jobError) {
      return NextResponse.json(
        { error: "Failed to create job", details: jobError },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test company created successfully with service role!",
      company: {
        id: company.id,
        name: company.name,
      },
      customer: {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
      },
      property: {
        id: property.id,
        address: `${property.address}, ${property.city}, ${property.state}`,
      },
      job: {
        id: job.id,
        title: job.title,
      },
      nextSteps: [
        "✅ Test company created successfully!",
        `🔗 View job at: /dashboard/work/${job.id}`,
        "📊 You should see the Operational Intelligence section!",
        "🔍 Check your terminal for enrichment logs",
      ],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
