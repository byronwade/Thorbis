import { redirect } from "next/navigation";

type EditJobPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Temporary Edit Job page stub.
 *
 * Next.js expects this route to exist based on the app directory structure.
 * For now, we simply redirect back to the job detail view. When a dedicated
 * edit experience is implemented, this file can be replaced with the real UI.
 */
export default async function EditJobPage({ params }: EditJobPageProps) {
  const { id } = await params;

  redirect(`/dashboard/work/${id}`);
}
