import { ArrowLeft, Copy, FileSignature, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Contract Templates Page - Server Component
 *
 * Allows users to create and manage reusable contract templates
 * for faster contract creation.
 */

const mockTemplates = [
  {
    id: "1",
    name: "Standard Service Agreement",
    description: "General service agreement for ongoing maintenance",
    category: "service",
    usageCount: 15,
    lastUsed: "2025-01-20",
  },
  {
    id: "2",
    name: "Annual Maintenance Contract",
    description: "Yearly maintenance contract with quarterly service",
    category: "maintenance",
    usageCount: 8,
    lastUsed: "2025-01-18",
  },
  {
    id: "3",
    name: "Emergency Service Agreement",
    description: "24/7 emergency service contract with priority response",
    category: "custom",
    usageCount: 5,
    lastUsed: "2025-01-15",
  },
  {
    id: "4",
    name: "Equipment Warranty Contract",
    description: "Extended warranty for installed equipment",
    category: "custom",
    usageCount: 12,
    lastUsed: "2025-01-22",
  },
];

export default function ContractTemplatesPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center gap-4 px-6 py-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/dashboard/work/contracts">
              <ArrowLeft className="mr-2 size-4" />
              Back to Contracts
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-2xl">Contract Templates</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage reusable contract templates
            </p>
          </div>
          <Button asChild size="sm">
            <Link href="/dashboard/work/contracts/templates/new">
              <Plus className="mr-2 size-4" />
              New Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl space-y-6 p-6">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{mockTemplates.length}</div>
                <p className="text-muted-foreground text-xs">
                  Active templates
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Most Popular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {mockTemplates[0]?.name.split(" ")[0] || "None"}
                </div>
                <p className="text-muted-foreground text-xs">
                  {mockTemplates[0]?.usageCount || 0} times used
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-medium text-sm">
                  Total Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">
                  {mockTemplates.reduce((sum, t) => sum + t.usageCount, 0)}
                </div>
                <p className="text-muted-foreground text-xs">
                  Contracts created
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Templates Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTemplates.map((template) => (
              <Card className="flex flex-col" key={template.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileSignature className="size-5 text-primary" />
                      </div>
                    </div>
                    <Badge className="capitalize" variant="outline">
                      {template.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Used:</span>
                      <span className="font-medium">
                        {template.usageCount} times
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last used:</span>
                      <span className="font-medium">
                        {new Date(template.lastUsed).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    size="sm"
                    variant="outline"
                  >
                    <Link
                      href={`/dashboard/work/contracts/new?templateId=${template.id}`}
                    >
                      <Copy className="mr-2 size-4" />
                      Use Template
                    </Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link
                      href={`/dashboard/work/contracts/templates/${template.id}`}
                    >
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {mockTemplates.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-muted p-4">
                  <FileSignature className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">No templates yet</h3>
                <p className="mb-4 text-center text-muted-foreground text-sm">
                  Create your first contract template to speed up your workflow
                </p>
                <Button asChild>
                  <Link href="/dashboard/work/contracts/templates/new">
                    <Plus className="mr-2 size-4" />
                    Create Template
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
