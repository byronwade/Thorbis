/**
 * Address Block - Custom Tiptap Node
 *
 * Displays and edits customer address inline:
 * - Street address (line 1 and 2)
 * - City, State, ZIP
 * - Country
 *
 * Inline-editable in edit mode, read-only display in view mode
 */

import { mergeAttributes, Node } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { MapPin } from "lucide-react";
import { CollapsibleDataSection } from "@/components/ui/collapsible-data-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// React component that renders the block
export function AddressBlockComponent({ node, updateAttributes, editor }: any) {
  const { address, address2, city, state, zipCode, country } = node.attrs;
  const isEditable = editor.isEditable;

  const fullAddress = [
    address,
    address2,
    [city, state].filter(Boolean).join(", "),
    zipCode,
    country !== "USA" ? country : null,
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <NodeViewWrapper className="address-block">
      <CollapsibleDataSection
        defaultOpen={true}
        icon={<MapPin className="size-5" />}
        standalone={true}
        storageKey="customer-address-section"
        title="Address"
        value="customer-address"
      >
        {isEditable ? (
          <div className="space-y-4">
            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor={`address-${node.attrs.id}`}>Street Address</Label>
              <Input
                id={`address-${node.attrs.id}`}
                onChange={(e) => updateAttributes({ address: e.target.value })}
                placeholder="123 Main Street"
                value={address || ""}
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor={`address2-${node.attrs.id}`}>
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                id={`address2-${node.attrs.id}`}
                onChange={(e) => updateAttributes({ address2: e.target.value })}
                placeholder="Suite 100"
                value={address2 || ""}
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor={`city-${node.attrs.id}`}>City</Label>
                <Input
                  id={`city-${node.attrs.id}`}
                  onChange={(e) => updateAttributes({ city: e.target.value })}
                  placeholder="San Francisco"
                  value={city || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`state-${node.attrs.id}`}>State</Label>
                <Input
                  id={`state-${node.attrs.id}`}
                  maxLength={2}
                  onChange={(e) => updateAttributes({ state: e.target.value })}
                  placeholder="CA"
                  value={state || ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`zipCode-${node.attrs.id}`}>ZIP Code</Label>
                <Input
                  id={`zipCode-${node.attrs.id}`}
                  onChange={(e) =>
                    updateAttributes({ zipCode: e.target.value })
                  }
                  placeholder="94102"
                  value={zipCode || ""}
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor={`country-${node.attrs.id}`}>Country</Label>
              <Input
                id={`country-${node.attrs.id}`}
                onChange={(e) => updateAttributes({ country: e.target.value })}
                placeholder="USA"
                value={country || "USA"}
              />
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-line text-sm">
            {fullAddress || (
              <p className="text-muted-foreground">No address on file</p>
            )}
          </div>
        )}
      </CollapsibleDataSection>
    </NodeViewWrapper>
  );
}

// Tiptap Node Extension
export const AddressBlock = Node.create({
  name: "addressBlock",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
      },
      address: {
        default: "",
      },
      address2: {
        default: "",
      },
      city: {
        default: "",
      },
      state: {
        default: "",
      },
      zipCode: {
        default: "",
      },
      country: {
        default: "USA",
      },
    } as any;
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="address-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "address-block" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AddressBlockComponent);
  },

  addCommands() {
    return {
      insertAddressBlock:
        (attributes: any) =>
        ({ commands }: any) =>
          commands.insertContent({
            type: this.name,
            attrs: attributes,
          }),
    } as any;
  },
});
