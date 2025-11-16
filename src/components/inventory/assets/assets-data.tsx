import { ComingSoonShell } from "@/components/ui/coming-soon-shell";
import { Briefcase } from "lucide-react";

export async function AssetsData() {
  return (
    <ComingSoonShell
      title="Asset Management"
      icon={Briefcase}
      description="Track company assets"
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
