/**
 * Resource Page Template - Server Component
 *
 * Reusable template for tool resource pages
 */

import { ArrowLeft, ExternalLink, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface ResourcePageProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  description: string[];
  sections?: Array<{
    title: string;
    description: string;
    content: React.ReactNode;
  }>;
  externalLinks?: Array<{
    title: string;
    description: string;
    url: string;
    icon: LucideIcon;
  }>;
}

export function ResourcePageTemplate({
  title,
  subtitle,
  icon: Icon,
  badge,
  description,
  sections = [],
  externalLinks = [],
}: ResourcePageProps) {
  return (
    <div className="space-y-8">
      {/* Back Navigation */}
      <div>
        <Button asChild size="sm" variant="ghost">
          <Link href="/dashboard/tools">
            <ArrowLeft className="mr-2 size-4" />
            Back to Tools
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5">
            <Icon className="size-8 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="font-bold text-4xl tracking-tight">{title}</h1>
              {badge && <Badge variant="default">{badge}</Badge>}
            </div>
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {description.map((paragraph, index) => (
            <p className="text-muted-foreground leading-relaxed" key={index}>
              {paragraph}
            </p>
          ))}
        </CardContent>
      </Card>

      {/* Additional Sections */}
      {sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-2xl">{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent>{section.content}</CardContent>
        </Card>
      ))}

      {/* External Links */}
      {externalLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Helpful Resources</CardTitle>
            <CardDescription>External links and documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {externalLinks.map((link) => {
                const LinkIcon = link.icon;
                return (
                  <a
                    className="group flex items-start gap-3 rounded-lg border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
                    href={link.url}
                    key={link.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <LinkIcon className="mt-1 size-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">{link.title}</h4>
                      <p className="text-muted-foreground text-sm">
                        {link.description}
                      </p>
                    </div>
                    <ExternalLink className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl">Need Help Getting Started?</CardTitle>
          <CardDescription>
            Our team can help you set up and optimize this resource
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/help">
              Contact Support
              <ExternalLink className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
