import { Package } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function MaterialsSettingsPage() {
  return (
    <SettingsComingSoon
      description="Configure how materials and parts affect payroll calculations and commissions."
      icon={Package}
      title="Materials Settings"
    />
  );
}
