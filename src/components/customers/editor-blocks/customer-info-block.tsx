/**
 * Customer Info Block - Custom Tiptap Node
 *
 * Displays customer basic information as an editable block:
 * - Name (first_name, last_name)
 * - Email
 * - Phone
 * - Company name
 * - Customer type badge
 *
 * This is a Tiptap Node Extension that renders as a React component
 * All fields are always editable (no view/edit mode toggle)
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Building2, Mail, Phone, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CollapsibleSectionWrapper } from "./collapsible-section-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// React component that renders the block
export function CustomerInfoBlockComponent({ node, updateAttributes, editor }: any) {
  const {
    displayName,
    firstName,
    lastName,
    email,
    phone,
    secondaryPhone,
    billingEmail,
    companyName,
    customerType
  } = node.attrs;

  return (
    <NodeViewWrapper className="customer-info-block">
      <CollapsibleSectionWrapper
        title="Customer Information"
        icon={<User className="size-5" />}
        defaultOpen={true}
        storageKey="customer-info-section"
        badge={<Badge variant="outline" className="capitalize">{customerType || "residential"}</Badge>}
      >
        <div className="space-y-6">
          {/* Profile Display Name - Full Width at Top */}
          <div className="space-y-2">
            <Label htmlFor={`displayName-${node.attrs.id}`} className="flex items-center gap-1">
              <User className="size-3" />
              Profile Display Name
            </Label>
            <Input
              id={`displayName-${node.attrs.id}`}
              value={displayName || ""}
              onChange={(e) => updateAttributes({ displayName: e.target.value })}
              placeholder="e.g., Mr. Wade, Ms. Johnson, The Smiths"
              className="text-lg font-medium"
            />
            <p className="text-muted-foreground text-xs">
              How you'd like to address this customer (nicknames, titles, etc.)
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor={`firstName-${node.attrs.id}`}>First Name *</Label>
              <Input
                id={`firstName-${node.attrs.id}`}
                value={firstName || ""}
                onChange={(e) => updateAttributes({ firstName: e.target.value })}
                placeholder="John"
              />
            </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor={`lastName-${node.attrs.id}`}>Last Name *</Label>
            <Input
              id={`lastName-${node.attrs.id}`}
              value={lastName || ""}
              onChange={(e) => updateAttributes({ lastName: e.target.value })}
              placeholder="Smith"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor={`email-${node.attrs.id}`} className="flex items-center gap-1">
              <Mail className="size-3" />
              Email *
            </Label>
            <Input
              id={`email-${node.attrs.id}`}
              type="email"
              value={email || ""}
              onChange={(e) => updateAttributes({ email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor={`phone-${node.attrs.id}`} className="flex items-center gap-1">
              <Phone className="size-3" />
              Phone *
            </Label>
            <Input
              id={`phone-${node.attrs.id}`}
              type="tel"
              value={phone || ""}
              onChange={(e) => updateAttributes({ phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Secondary Phone */}
          <div className="space-y-2">
            <Label htmlFor={`secondaryPhone-${node.attrs.id}`} className="flex items-center gap-1">
              <Phone className="size-3" />
              Secondary Phone
            </Label>
            <Input
              id={`secondaryPhone-${node.attrs.id}`}
              type="tel"
              value={secondaryPhone || ""}
              onChange={(e) => updateAttributes({ secondaryPhone: e.target.value })}
              placeholder="(555) 987-6543"
            />
          </div>

          {/* Billing Email */}
          <div className="space-y-2">
            <Label htmlFor={`billingEmail-${node.attrs.id}`} className="flex items-center gap-1">
              <Mail className="size-3" />
              Billing Email
            </Label>
            <Input
              id={`billingEmail-${node.attrs.id}`}
              type="email"
              value={billingEmail || ""}
              onChange={(e) => updateAttributes({ billingEmail: e.target.value })}
              placeholder="billing@example.com"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor={`companyName-${node.attrs.id}`} className="flex items-center gap-1">
              <Building2 className="size-3" />
              Company Name
            </Label>
            <Input
              id={`companyName-${node.attrs.id}`}
              value={companyName || ""}
              onChange={(e) => updateAttributes({ companyName: e.target.value })}
              placeholder="Acme Corporation"
            />
          </div>

          {/* Customer Type */}
          <div className="space-y-2">
            <Label htmlFor={`customerType-${node.attrs.id}`}>Customer Type *</Label>
            <Select
              value={customerType || "residential"}
              onValueChange={(value) => updateAttributes({ customerType: value })}
            >
              <SelectTrigger id={`customerType-${node.attrs.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industrial">Industrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>
      </CollapsibleSectionWrapper>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const CustomerInfoBlock = Node.create({
  name: "customerInfoBlock",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      displayName: {
        default: "",
      },
      firstName: {
        default: "",
      },
      lastName: {
        default: "",
      },
      email: {
        default: "",
      },
      phone: {
        default: "",
      },
      secondaryPhone: {
        default: "",
      },
      billingEmail: {
        default: "",
      },
      companyName: {
        default: "",
      },
      customerType: {
        default: "residential",
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="customer-info-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "customer-info-block" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomerInfoBlockComponent);
  },

  addCommands() {
    return {
      insertCustomerInfoBlock:
        (attributes: any) =>
        ({ commands }: any) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    } as any;
  },
});
