import { DashboardSkeleton } from "@/components/ui/skeletons";

/**
 * Loading UI for Dashboard - shown during Suspense streaming
 *
 * This component is automatically shown by Next.js while the page
 * is being server-rendered, providing instant feedback to users
 */
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}
