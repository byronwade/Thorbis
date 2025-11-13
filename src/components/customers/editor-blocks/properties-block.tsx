/**
 * Properties Block - Custom Tiptap Node
 *
 * Displays customer's properties as expandable cards
 * - Property name and address
 * - Property type badge
 * - Square footage, year built
 * - Equipment count
 * - Click to view property details
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import {
  Building2,
  ExternalLink,
  Factory,
  Home,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CollapsibleActionButton,
  CollapsibleDataSection,
} from "@/components/ui/collapsible-data-section";
import { cn } from "@/lib/utils";

// React component that renders the block
export function PropertiesBlockComponent({ node, editor }: any) {
  const { properties, customerId } = node.attrs;
  const isEditable = editor.isEditable;

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "commercial":
        return Building2;
      case "industrial":
        return Factory;
      default:
        return Home;
    }
  };

  const getPropertyBadge = (type: string) => {
    const variants: Record<string, string> = {
      residential: "bg-success text-success",
      commercial: "bg-primary text-primary",
      industrial: "bg-accent text-accent-foreground",
    } as any;

    return (
      <Badge className={cn("text-xs", variants[type] || variants.residential)}>
        {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Residential"}
      </Badge>
    );
  };

  if (!properties || properties.length === 0) {
    return (
      <NodeViewWrapper className="properties-block">
        <div className="not-prose my-6 rounded-lg border bg-muted/30 p-8 text-center">
          <Home className="mx-auto mb-3 size-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No properties on file</p>
        </div>
      </NodeViewWrapper>
    );
  }

  const handleAddProperty = () => {
    // Navigate to add property page with customer pre-selected
    window.location.href = `/dashboard/work/properties/new?customerId=${customerId}`;
  };

  return (
    <NodeViewWrapper className="properties-block">
      <CollapsibleDataSection
        actions={
          <CollapsibleActionButton
            icon={<Plus className="size-4" />}
            onClick={handleAddProperty}
          >
            Add Property
          </CollapsibleActionButton>
        }
        count={properties.length}
        defaultOpen={false}
        icon={<MapPin className="size-5" />}
        standalone={true}
        storageKey="customer-properties-section"
        title={`Properties (${properties.length})`}
        value="customer-properties"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {properties.map((property: any) => {
            const Icon = getPropertyIcon(property.type);
            return (
              <Card key={property.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 text-muted-foreground" />
                      <CardTitle className="text-base">
                        {property.name || property.address}
                      </CardTitle>
                    </div>
                    {getPropertyBadge(property.type)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-3 text-muted-foreground" />
                      <div>
                        <p>{property.address}</p>
                        {property.address2 && <p>{property.address2}</p>}
                        <p>
                          {property.city}, {property.state} {property.zip_code}
                        </p>
                      </div>
                    </div>

                    {(property.square_footage || property.year_built) && (
                      <div className="flex gap-4 text-muted-foreground text-xs">
                        {property.square_footage && (
                          <span>
                            {property.square_footage.toLocaleString()} sq ft
                          </span>
                        )}
                        {property.year_built && (
                          <span>Built {property.year_built}</span>
                        )}
                      </div>
                    )}

                    <Link
                      className="inline-flex items-center gap-1 text-primary text-xs hover:underline"
                      href={`/dashboard/customers/${property.customer_id}#property-${property.id}`}
                    >
                      View details
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CollapsibleDataSection>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const PropertiesBlock = Node.create({
  name: "propertiesBlock",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      properties: {
        default: [],
      },
      customerId: {
        default: null,
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="properties-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "properties-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PropertiesBlockComponent);
  },

  addCommands() {
    return {
      insertPropertiesBlock:
        (attributes: any) =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    } as any;
  },
});
