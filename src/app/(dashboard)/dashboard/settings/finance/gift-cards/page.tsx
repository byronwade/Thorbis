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
