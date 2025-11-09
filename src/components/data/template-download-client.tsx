"use client";

/**
 * Template Download Client Component
 *
 * Allows users to download import templates
 */

import { Download, FileSpreadsheet, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadExcelTemplate } from "@/lib/data/excel-template-generator";

interface TemplateDownloadClientProps {
  dataType: string;
}

export function TemplateDownloadClient({
  dataType,
}: TemplateDownloadClientProps) {
  const formatDataType = (type: string) =>
    type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleDownload = () => {
    downloadExcelTemplate(dataType);
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 py-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          Download {formatDataType(dataType)} Template
        </h1>
        <p className="mt-2 text-muted-foreground">
          Get a pre-formatted Excel template for importing your data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="size-5 text-green-600" />
            Excel Import Template
          </CardTitle>
          <CardDescription>
            This template includes all required fields and example data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">File Format</p>
                <p className="text-muted-foreground text-xs">
                  Microsoft Excel (.xlsx)
                </p>
              </div>
              <Badge>Excel</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Template Version</p>
                <p className="text-muted-foreground text-xs">Latest (v1.0)</p>
              </div>
              <Badge className="bg-green-500">Current</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium text-sm">Includes</p>
                <p className="text-muted-foreground text-xs">
                  Headers, validation, examples, instructions
                </p>
              </div>
              <Badge>Complete</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-blue-500/50 bg-blue-500/5 p-4">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 size-5 shrink-0 text-blue-500" />
              <div>
                <p className="font-medium text-sm">Template Features</p>
                <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Pre-formatted column headers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Data validation rules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Example rows with sample data
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-blue-500" />
                    Instructions sheet
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={handleDownload} size="lg">
            <Download className="mr-2 size-4" />
            Download Template
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
                1
              </div>
              <div>
                <p className="font-medium text-sm">Download the template</p>
                <p className="text-muted-foreground text-xs">
                  Click the button above to get your Excel template
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
                2
              </div>
              <div>
                <p className="font-medium text-sm">Fill in your data</p>
                <p className="text-muted-foreground text-xs">
                  Replace example rows with your actual data
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-xs">
                3
              </div>
              <div>
                <p className="font-medium text-sm">Import your data</p>
                <p className="text-muted-foreground text-xs">
                  Go to the import page and upload your filled template
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
