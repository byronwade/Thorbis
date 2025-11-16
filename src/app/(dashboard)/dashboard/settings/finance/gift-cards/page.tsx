import { Gift } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function GiftCardsSettingsPage() {
  return (
    <SettingsComingSoon
      description="Set up and manage gift card programs for your business."
      icon={<Gift className="size-10 text-primary" strokeWidth={1.5} />}
      title="Gift Cards Settings"
    />
  );
}
