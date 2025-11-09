import { PhoneCall } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function CallbacksSettingsPage() {
  return (
    <SettingsComingSoon
      description="Configure callback pay rates and policies for emergency or after-hours work."
      icon={PhoneCall}
      title="Callbacks Settings"
    />
  );
}
