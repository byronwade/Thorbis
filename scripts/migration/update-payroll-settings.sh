#!/bin/bash

# Batch update all payroll settings pages to use Coming Soon component

# Payroll Schedule
cat > "src/app/(dashboard)/dashboard/settings/payroll/schedule/page.tsx" << 'EOF'
import { Calendar } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function PayrollScheduleSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Calendar}
      title="Payroll Schedule Settings"
      description="Configure your payroll schedule, pay periods, and processing dates."
      backLink="/dashboard/settings"
    />
  );
}
EOF

# Overtime
cat > "src/app/(dashboard)/dashboard/settings/payroll/overtime/page.tsx" << 'EOF'
import { Clock } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function OvertimeSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Clock}
      title="Overtime Settings"
      description="Set overtime rules, rates, and approval workflows for your team."
    />
  );
}
EOF

# Materials
cat > "src/app/(dashboard)/dashboard/settings/payroll/materials/page.tsx" << 'EOF'
import { Package } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function MaterialsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Package}
      title="Materials Settings"
      description="Configure how materials and parts affect payroll calculations and commissions."
    />
  );
}
EOF

# Deductions
cat > "src/app/(dashboard)/dashboard/settings/payroll/deductions/page.tsx" << 'EOF'
import { MinusCircle } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function DeductionsSettingsPage() {
  return (
    <SettingsComingSoon
      icon={MinusCircle}
      title="Deductions Settings"
      description="Manage payroll deductions, garnishments, and benefit withholdings."
    />
  );
}
EOF

# Commission
cat > "src/app/(dashboard)/dashboard/settings/payroll/commission/page.tsx" << 'EOF'
import { TrendingUp } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function CommissionSettingsPage() {
  return (
    <SettingsComingSoon
      icon={TrendingUp}
      title="Commission Settings"
      description="Configure commission structures, tiers, and payment schedules for your team."
    />
  );
}
EOF

# Callbacks
cat > "src/app/(dashboard)/dashboard/settings/payroll/callbacks/page.tsx" << 'EOF'
import { PhoneCall } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function CallbacksSettingsPage() {
  return (
    <SettingsComingSoon
      icon={PhoneCall}
      title="Callbacks Settings"
      description="Configure callback pay rates and policies for emergency or after-hours work."
    />
  );
}
EOF

# Bonuses
cat > "src/app/(dashboard)/dashboard/settings/payroll/bonuses/page.tsx" << 'EOF'
import { Award } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function BonusesSettingsPage() {
  return (
    <SettingsComingSoon
      icon={Award}
      title="Bonuses Settings"
      description="Set up bonus structures, performance incentives, and reward programs."
    />
  );
}
EOF

echo "✅ Payroll settings pages updated successfully!"
