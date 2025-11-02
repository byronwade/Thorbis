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
