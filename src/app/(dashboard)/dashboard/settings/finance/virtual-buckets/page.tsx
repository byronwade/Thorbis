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
