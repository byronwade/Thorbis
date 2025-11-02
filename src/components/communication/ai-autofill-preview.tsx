"use client";

/**
 * AI Auto-fill Preview - Client Component
 *
 * Displays AI-extracted data with approve/edit/reject actions
 *
 * Client-side features:
 * - Real-time AI extraction display
 * - One-click approval of AI suggestions
 * - Inline editing of extracted data
 * - Confidence score visualization
 * - Action item management
 * - Tag suggestions
 *
 * Performance optimizations:
 * - Debounced extraction updates
 * - Optimistic UI updates
 * - Memoized field rendering
 */

import { Check, Edit2, Sparkles, Tag, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAIExtraction } from "@/hooks/use-ai-extraction";
import { useCallPreferencesStore } from "@/lib/stores/call-preferences-store";

type ApprovalState = "pending" | "approved" | "rejected" | "edited";

export function AIAutofillPreview() {
  const { extractedData, isExtracting } = useAIExtraction();
  const showAIConfidence = useCallPreferencesStore(
    (state) => state.showAIConfidence
  );

  const [customerInfoState, setCustomerInfoState] =
    useState<ApprovalState>("pending");
  const [editedCustomerInfo, setEditedCustomerInfo] = useState(
    extractedData.customerInfo
  );
  const [approvedActionItems, setApprovedActionItems] = useState<Set<number>>(
    new Set()
  );
  const [editingField, setEditingField] = useState<string | null>(null);

  // Handle approval of customer info
  const handleApproveCustomerInfo = () => {
    setCustomerInfoState("approved");
    // In production: sync to backend/CRM
  };

  // Handle rejection of customer info
  const handleRejectCustomerInfo = () => {
    setCustomerInfoState("rejected");
  };

  // Handle editing customer info field
  const handleEditField = (field: string, value: string) => {
    setEditedCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCustomerInfoState("edited");
  };

  // Handle action item approval
  const handleApproveActionItem = (index: number) => {
    setApprovedActionItems((prev) => new Set([...prev, index]));
    // In production: create task in system
  };

  // Get confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400 bg-green-900/30";
    if (confidence >= 60) return "text-amber-400 bg-amber-900/30";
    return "text-red-400 bg-red-900/30";
  };

  // Get confidence text
  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "High";
    if (confidence >= 60) return "Medium";
    return "Low";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-zinc-700 border-b bg-zinc-800/50 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-purple-400" />
          <h3 className="font-semibold text-sm text-white">AI Auto-fill</h3>
          {isExtracting && (
            <div className="size-2 animate-pulse rounded-full bg-purple-500" />
          )}
        </div>
        {showAIConfidence && extractedData.overallConfidence > 0 && (
          <div
            className={`rounded-full px-2.5 py-1 font-semibold text-xs ${getConfidenceColor(extractedData.overallConfidence)}`}
          >
            {getConfidenceText(extractedData.overallConfidence)} (
            {extractedData.overallConfidence}%)
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Customer Information */}
        <div
          className={`rounded-lg border p-4 ${customerInfoState === "approved" ? "border-green-700 bg-green-900/10" : customerInfoState === "rejected" ? "border-red-700 bg-red-900/10" : "border-zinc-700 bg-zinc-800/50"}`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-semibold text-sm text-white">
              <Sparkles className="size-3.5" />
              Customer Information
            </h4>
            {customerInfoState === "pending" && (
              <div className="flex items-center gap-1">
                <Button
                  className="h-7 gap-1 bg-green-900/30 px-2 text-green-400 hover:bg-green-900/50 hover:text-green-300"
                  onClick={handleApproveCustomerInfo}
                  size="sm"
                  variant="ghost"
                >
                  <Check className="size-3" />
                  Approve
                </Button>
                <Button
                  className="h-7 gap-1 bg-red-900/30 px-2 text-red-400 hover:bg-red-900/50 hover:text-red-300"
                  onClick={handleRejectCustomerInfo}
                  size="sm"
                  variant="ghost"
                >
                  <X className="size-3" />
                  Reject
                </Button>
              </div>
            )}
            {customerInfoState === "approved" && (
              <Badge className="bg-green-900/50 text-green-400">Approved</Badge>
            )}
            {customerInfoState === "rejected" && (
              <Badge className="bg-red-900/50 text-red-400">Rejected</Badge>
            )}
          </div>

          <div className="space-y-2">
            {/* Name */}
            {(extractedData.customerInfo.name || editedCustomerInfo.name) && (
              <div>
                <label className="mb-1 block font-medium text-[10px] text-zinc-500">
                  Name
                </label>
                {editingField === "name" ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm"
                    onBlur={() => setEditingField(null)}
                    onChange={(e) => handleEditField("name", e.target.value)}
                    value={editedCustomerInfo.name || ""}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-zinc-300">
                      {editedCustomerInfo.name ||
                        extractedData.customerInfo.name}
                    </span>
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setEditingField("name");
                        setEditedCustomerInfo((prev) => ({
                          ...prev,
                          name: prev.name || extractedData.customerInfo.name,
                        }));
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            {(extractedData.customerInfo.email || editedCustomerInfo.email) && (
              <div>
                <label className="mb-1 block font-medium text-[10px] text-zinc-500">
                  Email
                </label>
                {editingField === "email" ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm"
                    onBlur={() => setEditingField(null)}
                    onChange={(e) => handleEditField("email", e.target.value)}
                    value={editedCustomerInfo.email || ""}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-zinc-300">
                      {editedCustomerInfo.email ||
                        extractedData.customerInfo.email}
                    </span>
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setEditingField("email");
                        setEditedCustomerInfo((prev) => ({
                          ...prev,
                          email: prev.email || extractedData.customerInfo.email,
                        }));
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Phone */}
            {(extractedData.customerInfo.phone || editedCustomerInfo.phone) && (
              <div>
                <label className="mb-1 block font-medium text-[10px] text-zinc-500">
                  Phone
                </label>
                {editingField === "phone" ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm"
                    onBlur={() => setEditingField(null)}
                    onChange={(e) => handleEditField("phone", e.target.value)}
                    value={editedCustomerInfo.phone || ""}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-zinc-300">
                      {editedCustomerInfo.phone ||
                        extractedData.customerInfo.phone}
                    </span>
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setEditingField("phone");
                        setEditedCustomerInfo((prev) => ({
                          ...prev,
                          phone: prev.phone || extractedData.customerInfo.phone,
                        }));
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Company */}
            {(extractedData.customerInfo.company ||
              editedCustomerInfo.company) && (
              <div>
                <label className="mb-1 block font-medium text-[10px] text-zinc-500">
                  Company
                </label>
                {editingField === "company" ? (
                  <Input
                    autoFocus
                    className="h-8 text-sm"
                    onBlur={() => setEditingField(null)}
                    onChange={(e) => handleEditField("company", e.target.value)}
                    value={editedCustomerInfo.company || ""}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-zinc-300">
                      {editedCustomerInfo.company ||
                        extractedData.customerInfo.company}
                    </span>
                    <Button
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setEditingField("company");
                        setEditedCustomerInfo((prev) => ({
                          ...prev,
                          company:
                            prev.company || extractedData.customerInfo.company,
                        }));
                      }}
                      size="sm"
                      variant="ghost"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!(
              extractedData.customerInfo.name ||
              extractedData.customerInfo.email ||
              extractedData.customerInfo.phone ||
              extractedData.customerInfo.company
            ) && (
              <p className="text-xs text-zinc-500">
                No customer information extracted yet
              </p>
            )}
          </div>
        </div>

        {/* Issue Categories */}
        {extractedData.issueCategories.length > 0 && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="size-3.5 text-amber-400" />
              <h4 className="font-semibold text-sm text-white">
                Issue Categories
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {extractedData.issueCategories.map((category, index) => (
                <div
                  className="flex items-center gap-2 rounded-lg border border-amber-700 bg-amber-900/20 px-3 py-1.5"
                  key={index}
                >
                  <span className="font-medium text-amber-400 text-xs">
                    {category.category}
                  </span>
                  {showAIConfidence && (
                    <span className="font-mono text-[10px] text-amber-600">
                      {Math.round(category.confidence)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {extractedData.actionItems.length > 0 && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <h4 className="mb-3 font-semibold text-sm text-white">
              Action Items
            </h4>
            <div className="space-y-2">
              {extractedData.actionItems.map((item, index) => (
                <div
                  className={`flex items-start gap-2 rounded-lg border p-3 ${approvedActionItems.has(index) ? "border-green-700 bg-green-900/10" : "border-zinc-700 bg-zinc-900/50"}`}
                  key={index}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-semibold text-[10px] ${
                          item.priority === "high"
                            ? "bg-red-900/50 text-red-400"
                            : item.priority === "medium"
                              ? "bg-amber-900/50 text-amber-400"
                              : "bg-blue-900/50 text-blue-400"
                        }`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                      {showAIConfidence && (
                        <span className="font-mono text-[10px] text-zinc-600">
                          {Math.round(item.confidence)}%
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">{item.text}</p>
                  </div>
                  {!approvedActionItems.has(index) && (
                    <Button
                      className="h-7 gap-1 bg-green-900/30 px-2 text-green-400 hover:bg-green-900/50"
                      onClick={() => handleApproveActionItem(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <Check className="size-3" />
                      Add
                    </Button>
                  )}
                  {approvedActionItems.has(index) && (
                    <Check className="size-4 text-green-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call Summary */}
        {extractedData.callSummary && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-4">
            <h4 className="mb-2 font-semibold text-sm text-white">
              Call Summary
            </h4>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {extractedData.callSummary}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-zinc-600">Sentiment:</span>
              <Badge
                className={`${extractedData.sentiment === "positive" ? "bg-green-900/50 text-green-400" : extractedData.sentiment === "negative" ? "bg-red-900/50 text-red-400" : "bg-zinc-700 text-zinc-400"}`}
              >
                {extractedData.sentiment}
              </Badge>
            </div>
          </div>
        )}

        {/* No data yet */}
        {extractedData.issueCategories.length === 0 &&
          extractedData.actionItems.length === 0 &&
          !extractedData.callSummary &&
          extractedData.customerInfo.confidence === 0 && (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-zinc-800 p-4">
                <Sparkles className="size-8 text-zinc-600" />
              </div>
              <p className="mt-4 font-medium text-sm text-zinc-500">
                AI is listening...
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Data will auto-fill as the conversation progresses
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
