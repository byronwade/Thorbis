/**
 * Invoice Email Template Settings Page
 *
 * Customize the email template sent with invoices
 *
 * Features:
 * - Subject line customization
 * - Email body with variable support
 * - Preview with sample data
 * - Save/load from database
 */

"use client";

import { Eye, Loader2, Mail, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  type InvoiceEmailTemplate,
  loadInvoiceEmailTemplate,
  saveInvoiceEmailTemplate,
} from "@/actions/settings/invoice-email-template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const TEMPLATE_VARIABLES = [
  { name: "{{customer_name}}", description: "Customer's full name" },
  {
    name: "{{invoice_number}}",
    description: "Invoice number (e.g., INV-202511-0001)",
  },
  { name: "{{invoice_amount}}", description: "Total invoice amount" },
  { name: "{{due_date}}", description: "Payment due date" },
  { name: "{{payment_link}}", description: "Secure payment portal link" },
  { name: "{{company_name}}", description: "Your company name" },
  { name: "{{company_email}}", description: "Your company email" },
  { name: "{{company_phone}}", description: "Your company phone" },
];

const DEFAULT_TEMPLATE: InvoiceEmailTemplate = {
  subject: "Invoice {{invoice_number}} from {{company_name}}",
  body: `Hi {{customer_name}},

Please find attached your invoice {{invoice_number}} for {{invoice_amount}}.

Payment is due by {{due_date}}.

You can securely pay your invoice online by clicking the link below:
{{payment_link}}

If you have any questions about this invoice, please contact us at {{company_email}} or {{company_phone}}.

Thank you for your business!

Best regards,
{{company_name}}`,
  footer: "This is an automated message. Please do not reply to this email.",
};

export default function InvoiceEmailTemplatePage() {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [template, setTemplate] =
    useState<InvoiceEmailTemplate>(DEFAULT_TEMPLATE);

  // Load template from database
  useEffect(() => {
    startTransition(async () => {
      setIsLoading(true);
      const result = await loadInvoiceEmailTemplate();

      if (result.success && result.data) {
        setTemplate(result.data);
      }

      setIsLoading(false);
    });
  }, []);

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveInvoiceEmailTemplate(template);

      if (result.success) {
        toast.success("Email template saved", {
          description: "Your invoice email template has been updated.",
        });
      } else {
        toast.error("Failed to save template", {
          description: result.error || "Please try again.",
        });
      }
    });
  };

  const handleInsertVariable = (variable: string) => {
    const textarea = document.getElementById(
      "email-body"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = template.body;
    const before = text.substring(0, start);
    const after = text.substring(end);

    setTemplate({
      ...template,
      body: before + variable + after,
    });

    // Set cursor position after variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variable.length,
        start + variable.length
      );
    }, 0);
  };

  const getPreviewText = (text: string) =>
    text
      .replace(/{{customer_name}}/g, "John Doe")
      .replace(/{{invoice_number}}/g, "INV-202511-0001")
      .replace(/{{invoice_amount}}/g, "$1,234.56")
      .replace(/{{due_date}}/g, "December 15, 2024")
      .replace(
        /{{payment_link}}/g,
        "https://app.thorbis.com/pay/abc123?token=xyz789"
      )
      .replace(/{{company_name}}/g, "Acme Services")
      .replace(/{{company_email}}/g, "billing@acmeservices.com")
      .replace(/{{company_phone}}/g, "(555) 123-4567");

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl">Invoice Email Template</h1>
        <p className="text-muted-foreground">
          Customize the email that customers receive when you send them an
          invoice
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Template Editor */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Template
              </CardTitle>
              <CardDescription>
                Use variables to personalize emails for each invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Line */}
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject Line</Label>
                <Input
                  id="email-subject"
                  onChange={(e) =>
                    setTemplate({ ...template, subject: e.target.value })
                  }
                  placeholder="Invoice subject line..."
                  value={template.subject}
                />
              </div>

              {/* Email Body */}
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  className="font-mono text-sm"
                  id="email-body"
                  onChange={(e) =>
                    setTemplate({ ...template, body: e.target.value })
                  }
                  placeholder="Email body text..."
                  rows={12}
                  value={template.body}
                />
              </div>

              {/* Footer */}
              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer</Label>
                <Input
                  id="email-footer"
                  onChange={(e) =>
                    setTemplate({ ...template, footer: e.target.value })
                  }
                  placeholder="Email footer text..."
                  value={template.footer}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  disabled={isPending}
                  onClick={handleSave}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Template
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showPreview ? "Hide" : "Show"} Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How the email will look with sample data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs">
                    Subject
                  </Label>
                  <p className="mt-1 font-medium">
                    {getPreviewText(template.subject)}
                  </p>
                </div>
                <Separator />
                <div>
                  <Label className="text-muted-foreground text-xs">Body</Label>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {getPreviewText(template.body)}
                  </p>
                </div>
                {template.footer && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Footer
                      </Label>
                      <p className="mt-1 text-muted-foreground text-sm">
                        {getPreviewText(template.footer)}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Variables Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Available Variables</CardTitle>
              <CardDescription className="text-xs">
                Click to insert into email body
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {TEMPLATE_VARIABLES.map((variable) => (
                <button
                  className="w-full rounded-md border p-3 text-left transition-colors hover:bg-accent"
                  key={variable.name}
                  onClick={() => handleInsertVariable(variable.name)}
                >
                  <div className="mb-1 font-mono text-xs">
                    <Badge className="font-mono text-xs" variant="secondary">
                      {variable.name}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {variable.description}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                • Keep your subject line clear and concise
              </p>
              <p className="text-muted-foreground">
                • Include payment instructions and due date
              </p>
              <p className="text-muted-foreground">
                • Add a personal touch to build customer relationships
              </p>
              <p className="text-muted-foreground">
                • Include contact information for questions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
