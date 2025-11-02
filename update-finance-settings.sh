#!/bin/bash

# Batch update all finance settings pages to use Coming Soon component

# Bank Accounts
cat > "src/app/(dashboard)/dashboard/settings/finance/bank-accounts/page.tsx" << 'EOF'
import { Building2 } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BankAccountsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Building2}
      title="Bank Accounts Settings"
      description="Connect and manage your business bank accounts for streamlined financial management."
    />
  );
}
EOF

# Bookkeeping (already done, skip)

# Business Financing
cat > "src/app/(dashboard)/dashboard/settings/finance/business-financing/page.tsx" << 'EOF'
import { TrendingUp } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BusinessFinancingSettingsPage() {
  return (
    <SettingsComingSoon
      icon={TrendingUp}
      title="Business Financing Settings"
      description="Configure business loan and financing options for your company."
    />
  );
}
EOF

# Consumer Financing
cat > "src/app/(dashboard)/dashboard/settings/finance/consumer-financing/page.tsx" << 'EOF'
import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function ConsumerFinancingSettingsPage() {
  return (
    <SettingsComingSoon
      icon={CreditCard}
      title="Consumer Financing Settings"
      description="Set up customer financing options and payment plans for your services."
    />
  );
}
EOF

# Debit Cards
cat > "src/app/(dashboard)/dashboard/settings/finance/debit-cards/page.tsx" << 'EOF'
import { CreditCard } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DebitCardsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={CreditCard}
      title="Debit Cards Settings"
      description="Manage company debit cards and spending controls for your team."
    />
  );
}
EOF

# Gas Cards
cat > "src/app/(dashboard)/dashboard/settings/finance/gas-cards/page.tsx" << 'EOF'
import { Fuel } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function GasCardsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Fuel}
      title="Gas Cards Settings"
      description="Configure gas card programs and fuel expense tracking for your fleet."
    />
  );
}
EOF

# Gift Cards
cat > "src/app/(dashboard)/dashboard/settings/finance/gift-cards/page.tsx" << 'EOF'
import { Gift } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function GiftCardsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Gift}
      title="Gift Cards Settings"
      description="Set up and manage gift card programs for your business."
    />
  );
}
EOF

# Virtual Buckets
cat > "src/app/(dashboard)/dashboard/settings/finance/virtual-buckets/page.tsx" << 'EOF'
import { Layers } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function VirtualBucketsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Layers}
      title="Virtual Buckets Settings"
      description="Configure virtual budget buckets for better cash flow management."
    />
  );
}
EOF

echo "✅ Finance settings pages updated successfully!"
