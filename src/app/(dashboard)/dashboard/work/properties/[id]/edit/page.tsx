import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Property Edit Page - Placeholder
 *
 * TODO: Implement property editing functionality
 */

type PropertyEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyEditPage({
  params,
}: PropertyEditPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div>
        <Button asChild className="mb-4" size="sm" variant="ghost">
          <Link href={`/dashboard/work/properties/${id}`}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Property
          </Link>
        </Button>
        <h1 className="font-bold text-3xl tracking-tight">Edit Property</h1>
        <p className="mt-1 text-muted-foreground">
          Update property information
        </p>
      </div>

      {/* Coming Soon Card */}
      <Card>
        <CardHeader>
          <CardTitle>Property Editing</CardTitle>
          <CardDescription>
            Property editing functionality is coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            For now, properties are managed automatically when you create jobs
            or customers. If you need to update property information, please
            contact support.
          </p>
          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link href={`/dashboard/work/properties/${id}`}>
                View Property
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/dashboard/work/new?propertyId=${id}`}>
                Create Job
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
