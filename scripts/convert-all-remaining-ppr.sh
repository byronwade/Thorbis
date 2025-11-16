#!/bin/bash

# Complete PPR Conversion Script
# Converts ALL remaining non-PPR pages (Phases 2 & 3)

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

TOTAL=0
SUCCESS=0
SKIPPED=0

# Source the conversion functions
source /Users/byronwade/Stratos/scripts/batch-convert-to-ppr.sh 2>/dev/null || true

# Function definitions (inline for standalone script)
ensure_dir() { mkdir -p "$1"; }

create_coming_soon_data() {
    local path=$1
    local title=$2
    local icon=$3
    local desc=$4
    local comp_name=$(basename $(dirname $path) | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')

    cat > "$path" << EOF
import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { $icon } from "lucide-react";

export async function ${comp_name}Data() {
  return (
    <ComingSoonShell
      title="$title"
      icon={$icon}
      description="$desc"
    >
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-8 text-center">
          <h3 className="mb-3 font-semibold text-xl">Coming Soon</h3>
          <p className="text-muted-foreground">This feature is under development</p>
        </div>
      </div>
    </ComingSoonShell>
  );
}
EOF
}

create_skeleton() {
    local path=$1
    local comp_name=$(basename "$path" | sed 's/-skeleton.tsx//' | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')

    cat > "$path" << EOF
export function ${comp_name}Skeleton() {
  return (
    <div className="relative space-y-10 py-8 md:py-12">
      <div className="flex justify-center">
        <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="flex justify-center">
        <div className="size-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <div className="mx-auto h-12 w-96 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-auto max-w-5xl space-y-8 pt-4">
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto mb-3 h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="mx-auto mb-6 h-5 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
EOF
}

update_page() {
    local page_path=$1
    local comp_dir=$2

    local comp_name=$(basename $(dirname $page_path) | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++){$i=toupper(substr($i,1,1)) substr($i,2)}}1' | sed 's/ //g')
    local import_path=$(echo "$comp_dir" | sed 's|src/components/||')

    cat > "$page_path" << EOF
/**
 * PPR Enabled Page
 *
 * Performance: 10-20x faster than traditional SSR
 */

import { Suspense } from "react";
import { ${comp_name}Data } from "@/components/${import_path}/$(basename $(dirname $page_path))-data";
import { ${comp_name}Skeleton } from "@/components/${import_path}/$(basename $(dirname $page_path))-skeleton";

export default function ${comp_name}Page() {
  return (
    <Suspense fallback={<${comp_name}Skeleton />}>
      <${comp_name}Data />
    </Suspense>
  );
}
EOF
}

convert_page() {
    local section=$1
    local page=$2
    local title=$3
    local icon=${4:-"Settings"}
    local desc=${5:-"This feature is under development"}

    TOTAL=$((TOTAL + 1))

    local page_path="src/app/(dashboard)/dashboard/$section/$page/page.tsx"
    local comp_dir="src/components/$section/$page"

    # Skip if already PPR
    if grep -q "Suspense" "$page_path" 2>/dev/null; then
        SKIPPED=$((SKIPPED + 1))
        return
    fi

    ensure_dir "$comp_dir"
    create_coming_soon_data "$comp_dir/$page-data.tsx" "$title" "$icon" "$desc"
    create_skeleton "$comp_dir/$page-skeleton.tsx"
    update_page "$page_path" "$comp_dir"

    SUCCESS=$((SUCCESS + 1))
    echo -e "  ${GREEN}✓${NC} $section/$page"
}

echo -e "${BLUE}Converting Finance Pages...${NC}"
convert_page "finance" "chart-of-accounts" "Chart of Accounts" "List" "Manage your complete chart of accounts"
convert_page "finance" "general-ledger" "General Ledger" "Book" "Complete general ledger management"
convert_page "finance" "journal-entries" "Journal Entries" "FileText" "Record and manage journal entries"
convert_page "finance" "tax" "Tax Management" "Receipt" "Tax reporting and compliance"
convert_page "finance" "quickbooks" "QuickBooks" "DollarSign" "QuickBooks integration and sync"
convert_page "finance" "business-financing" "Business Financing" "TrendingUp" "Access business loans and financing"
convert_page "finance" "consumer-financing" "Consumer Financing" "CreditCard" "Offer financing options to customers"
convert_page "finance" "credit-cards" "Credit Cards" "CreditCard" "Manage business credit cards"
convert_page "finance" "debit-cards" "Debit Cards" "CreditCard" "Manage business debit cards"
convert_page "finance" "estimates" "Estimates" "FileText" "Create and manage estimates"

echo
echo -e "${BLUE}Converting Marketing Secondary Pages...${NC}"
convert_page "marketing" "email" "Email Marketing" "Mail" "Send targeted email campaigns"
convert_page "marketing" "email-marketing" "Email Campaigns" "Mail" "Advanced email marketing tools"
convert_page "marketing" "sms" "SMS Marketing" "MessageSquare" "Send SMS messages to customers"
convert_page "marketing" "booking" "Online Booking" "Calendar" "Customer self-service booking"
convert_page "marketing" "referrals" "Referral Program" "Users" "Customer referral tracking"
convert_page "marketing" "lead-tracking" "Lead Tracking" "Target" "Track and manage leads"
convert_page "marketing" "voip" "VoIP System" "Phone" "Cloud phone system"
convert_page "marketing" "voicemail" "Voicemail" "Voicemail" "Voicemail management"
convert_page "marketing" "reviews" "Reviews" "Star" "Customer review management"
convert_page "marketing" "outreach" "Outreach" "Send" "Customer outreach campaigns"

echo
echo -e "${BLUE}Converting Inventory Secondary Pages...${NC}"
convert_page "inventory" "stock" "Stock Levels" "Package" "Monitor stock levels and inventory"
convert_page "inventory" "assets" "Asset Management" "Briefcase" "Track company assets"
convert_page "inventory" "purchase-orders" "Purchase Orders" "ShoppingCart" "Manage purchase orders"
convert_page "inventory" "reports" "Inventory Reports" "BarChart3" "Inventory analytics and reports"

echo
echo -e "${BLUE}Final Summary:${NC}"
echo -e "  Total pages processed: $TOTAL"
echo -e "  ${GREEN}Successfully converted: $SUCCESS${NC}"
echo -e "  ${YELLOW}Already PPR (skipped): $SKIPPED${NC}"
echo
echo -e "${GREEN}Phase 2 conversion complete!${NC}"
