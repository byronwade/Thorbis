/**
 * Minimal test page to verify route works
 */

export default async function JobDetailsPageTest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = await params;

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl">Job Details Test Page</h1>
      <p>Job ID: {jobId}</p>
      <p>If you see this, the route is working!</p>
    </div>
  );
}
