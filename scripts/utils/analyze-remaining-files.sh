#!/bin/bash

# Script to analyze remaining files and identify which domain fields they use

echo "==================================================================="
echo "Job Domain Migration - Field Usage Analysis"
echo "==================================================================="
echo ""

# Define removed fields by domain
FINANCIAL_FIELDS="total_amount|paid_amount|deposit_amount|deposit_paid_at|payment_terms|payment_due_date|invoice_generated_at"
WORKFLOW_FIELDS="workflow_stage|template_id|workflow_completed_stages"
TIME_FIELDS="actual_start|actual_end|technician_clock_in|technician_clock_out|total_labor_hours|estimated_labor_hours"
APPROVAL_FIELDS="customer_approval_status|customer_signature|customer_notes"
QUALITY_FIELDS="quality_score|customer_satisfaction_rating|inspection_required"
AI_FIELDS="ai_categories|ai_equipment|ai_service_type"
EQUIPMENT_FIELDS="primary_equipment_id|job_service_agreement_id"
DISPATCH_FIELDS="dispatch_zone|route_order"
SAFETY_FIELDS="requires_permit|hazards_identified"
MULTI_FIELDS="primary_customer_id|primary_property_id|deleted_by"

# Function to analyze a file
analyze_file() {
    local file="$1"
    local filename=$(basename "$file")

    echo "-------------------------------------------------------------------"
    echo "File: $file"
    echo "-------------------------------------------------------------------"

    # Check for field references
    local has_fields=false

    # Financial fields
    if grep -qE "\.($FINANCIAL_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ FINANCIAL domain fields found:"
        grep -nE "\.($FINANCIAL_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Time tracking fields
    if grep -qE "\.($TIME_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ TIME TRACKING domain fields found:"
        grep -nE "\.($TIME_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Workflow fields
    if grep -qE "\.($WORKFLOW_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ WORKFLOW domain fields found:"
        grep -nE "\.($WORKFLOW_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Customer approval fields
    if grep -qE "\.($APPROVAL_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ CUSTOMER APPROVAL domain fields found:"
        grep -nE "\.($APPROVAL_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Quality fields
    if grep -qE "\.($QUALITY_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ QUALITY domain fields found:"
        grep -nE "\.($QUALITY_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # AI enrichment fields
    if grep -qE "\.($AI_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ AI ENRICHMENT domain fields found:"
        grep -nE "\.($AI_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Equipment service fields
    if grep -qE "\.($EQUIPMENT_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ EQUIPMENT SERVICE domain fields found:"
        grep -nE "\.($EQUIPMENT_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Dispatch fields
    if grep -qE "\.($DISPATCH_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ DISPATCH domain fields found:"
        grep -nE "\.($DISPATCH_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Safety fields
    if grep -qE "\.($SAFETY_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ SAFETY domain fields found:"
        grep -nE "\.($SAFETY_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    # Multi-entity fields
    if grep -qE "\.($MULTI_FIELDS)" "$file" 2>/dev/null; then
        echo "✓ MULTI-ENTITY domain fields found:"
        grep -nE "\.($MULTI_FIELDS)" "$file" | head -5 | sed 's/^/  /'
        has_fields=true
    fi

    if [ "$has_fields" = false ]; then
        echo "⚠ No removed field references found (may use SELECT * or indirect access)"
    fi

    echo ""
}

# Remaining high-priority files
echo ""
echo "HIGH PRIORITY - Actions & API Routes"
echo "==================================================================="

analyze_file "src/actions/estimates.ts"
analyze_file "src/actions/invoice-payments.ts"
analyze_file "src/actions/invoices.ts"
analyze_file "src/actions/payments/process-invoice-payment.ts"
analyze_file "src/actions/purchase-orders.ts"
analyze_file "src/actions/schedule-assignments.ts"
analyze_file "src/actions/schedules.ts"
analyze_file "src/app/(public)/pay/[invoiceId]/page.tsx"

echo ""
echo "HIGH PRIORITY - Job Detail Components"
echo "==================================================================="

analyze_file "src/components/work/job-details/tabs/overview-tab.tsx"
analyze_file "src/components/work/job-details/tabs/team-schedule-tab.tsx"
analyze_file "src/components/work/job-details/tabs/financials-tab.tsx"
analyze_file "src/components/work/job-details/job-appointments-table.tsx"
analyze_file "src/components/work/job-details/job-estimates-table.tsx"
analyze_file "src/components/work/job-details/job-invoices-table.tsx"
analyze_file "src/components/work/job-details/job-purchase-orders-table.tsx"
analyze_file "src/components/work/job-details/sections/job-estimates.tsx"
analyze_file "src/components/work/job-details/sections/job-invoices.tsx"
analyze_file "src/components/work/job-details/smart-badges/linked-data-alerts.tsx"
analyze_file "src/components/call-window/customer-sidebar.tsx"

echo ""
echo "==================================================================="
echo "Analysis Complete"
echo "==================================================================="
echo ""
echo "Next steps:"
echo "1. Review field usage above to determine which domains are needed"
echo "2. Update SELECT queries to include required domain tables"
echo "3. Replace direct field access with domain access (e.g., job.financial?.total_amount)"
echo "4. Add optional chaining (?.) for all domain field accesses"
echo "5. Test each file after updating"
echo ""
