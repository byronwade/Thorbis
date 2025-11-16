import { Layers } from "lucide-react";
import { SettingsComingSoon } from "@/components/settings/settings-coming-soon";

export default function VirtualBucketsSettingsPage() {
  return (
    <SettingsComingSoon
      description="Configure virtual budget buckets for better cash flow management."
      icon={<Layers className="size-10 text-primary" strokeWidth={1.5} />}
      title="Virtual Buckets Settings"
    />
  );
}
