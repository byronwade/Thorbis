/**
 * useAIExtraction Hook
 *
 * Custom hook for AI-powered data extraction from call transcripts
 *
 * Features:
 * - Extract customer information (name, email, phone, company)
 * - Categorize issues automatically
 * - Generate action items from conversation
 * - Auto-generate call summary
 * - Sentiment analysis
 * - Confidence scoring for each extraction
 *
 * Note: This is a mock implementation using pattern matching.
 * In production, replace with actual AI API calls.
 */

import { useCallback, useEffect, useState } from "react";
import {
  type TranscriptEntry,
  useTranscriptStore,
} from "@/lib/stores/transcript-store";

export type AIExtractedData = {
  customerInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    confidence: number;
  };
  issueCategories: Array<{
    category: string;
    confidence: number;
  }>;
  actionItems: Array<{
    text: string;
    priority: "low" | "medium" | "high";
    confidence: number;
  }>;
  callSummary: string;
  sentiment: "positive" | "neutral" | "negative";
  overallConfidence: number;
  tags: string[];
};

// Pattern matching for extraction
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
const PHONE_REGEX =
  /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/g;

// Issue category keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  billing: [
    "bill",
    "charge",
    "payment",
    "invoice",
    "refund",
    "credit",
    "fee",
    "price",
    "cost",
  ],
  technical: [
    "error",
    "bug",
    "broken",
    "not working",
    "crash",
    "issue",
    "problem",
    "technical",
    "system",
  ],
  account: [
    "account",
    "login",
    "password",
    "access",
    "profile",
    "settings",
    "verify",
  ],
  product: [
    "product",
    "feature",
    "how to",
    "question",
    "explain",
    "understand",
    "use",
  ],
  shipping: [
    "shipping",
    "delivery",
    "tracking",
    "package",
    "order",
    "received",
    "arrive",
  ],
  "customer service": [
    "complaint",
    "unhappy",
    "disappointed",
    "frustrated",
    "angry",
    "upset",
  ],
};

// Sentiment keywords
const SENTIMENT_KEYWORDS = {
  positive: [
    "thank",
    "thanks",
    "great",
    "excellent",
    "perfect",
    "love",
    "happy",
    "satisfied",
    "appreciate",
  ],
  negative: [
    "terrible",
    "awful",
    "worst",
    "horrible",
    "angry",
    "frustrated",
    "disappointed",
    "unhappy",
    "upset",
  ],
};

// Action item patterns
const ACTION_PATTERNS = [
  /(?:I'll|I will|we'll|we will|let me)\s+(.+?)(?:\.|$)/gi,
  /(?:need to|have to|must|should)\s+(.+?)(?:\.|$)/gi,
  /(?:follow up|callback|send|email|call back)\s+(.+?)(?:\.|$)/gi,
];

export function useAIExtraction() {
  const entries = useTranscriptStore((state) => state.entries);
  const [extractedData, setExtractedData] = useState<AIExtractedData>({
    customerInfo: {
      name: null,
      email: null,
      phone: null,
      company: null,
      confidence: 0,
    },
    issueCategories: [],
    actionItems: [],
    callSummary: "",
    sentiment: "neutral",
    overallConfidence: 0,
    tags: [],
  });
  const [isExtracting, setIsExtracting] = useState(false);

  // Extract customer information
  const extractCustomerInfo = useCallback((text: string) => {
    const emails = text.match(EMAIL_REGEX) || [];
    const phones = text.match(PHONE_REGEX) || [];

    // Extract name (look for "my name is" or "this is" patterns)
    let name: string | null = null;
    const nameMatch = text.match(
      /(?:my name is|this is|I'm|I am)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i
    );
    if (nameMatch) {
      name = nameMatch[1];
    }

    // Extract company (look for "from" or "at" patterns)
    let company: string | null = null;
    const companyMatch = text.match(
      /(?:from|at|work for|with)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:Inc|LLC|Corp|Corporation|Ltd))?)/i
    );
    if (companyMatch) {
      company = companyMatch[1];
    }

    const confidence =
      [name, emails[0], phones[0], company].filter(Boolean).length * 25;

    return {
      name,
      email: emails[0] || null,
      phone: phones[0] || null,
      company,
      confidence,
    };
  }, []);

  // Extract issue categories
  const extractIssueCategories = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    const categories: Record<string, number> = {};

    Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
      const matches = keywords.filter((keyword) =>
        lowerText.includes(keyword)
      ).length;
      if (matches > 0) {
        categories[category] = matches;
      }
    });

    return Object.entries(categories)
      .map(([category, matches]) => ({
        category,
        confidence: Math.min(100, matches * 20 + 40),
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
  }, []);

  // Extract action items
  const extractActionItems = useCallback(
    (text: string, speaker: "csr" | "customer") => {
      const items: Array<{
        text: string;
        priority: "low" | "medium" | "high";
        confidence: number;
      }> = [];

      // Only extract from CSR speech (actions they commit to)
      if (speaker === "csr") {
        ACTION_PATTERNS.forEach((pattern) => {
          const matches = [...text.matchAll(pattern)];
          matches.forEach((match) => {
            if (match[1] && match[1].trim().length > 5) {
              const text = match[1].trim();
              // Determine priority based on keywords
              let priority: "low" | "medium" | "high" = "medium";
              if (
                text.toLowerCase().includes("urgent") ||
                text.toLowerCase().includes("immediately")
              ) {
                priority = "high";
              } else if (
                text.toLowerCase().includes("when possible") ||
                text.toLowerCase().includes("eventually")
              ) {
                priority = "low";
              }

              items.push({
                text,
                priority,
                confidence: 75 + Math.random() * 20,
              });
            }
          });
        });
      }

      return items;
    },
    []
  );

  // Analyze sentiment
  const analyzeSentiment = useCallback(
    (text: string): "positive" | "neutral" | "negative" => {
      const lowerText = text.toLowerCase();
      let positiveScore = 0;
      let negativeScore = 0;

      SENTIMENT_KEYWORDS.positive.forEach((word) => {
        if (lowerText.includes(word)) positiveScore++;
      });

      SENTIMENT_KEYWORDS.negative.forEach((word) => {
        if (lowerText.includes(word)) negativeScore++;
      });

      if (positiveScore > negativeScore) return "positive";
      if (negativeScore > positiveScore) return "negative";
      return "neutral";
    },
    []
  );

  // Generate call summary
  const generateSummary = useCallback((entries: TranscriptEntry[]) => {
    if (entries.length === 0) return "No conversation yet.";

    const customerEntries = entries.filter((e) => e.speaker === "customer");
    const csrEntries = entries.filter((e) => e.speaker === "csr");

    // Simple summary generation
    const firstCustomerMessage = customerEntries[0]?.text || "";
    const mainIssue = firstCustomerMessage.slice(0, 100);

    return `Customer contacted regarding: ${mainIssue}${mainIssue.length >= 100 ? "..." : ""}. CSR is currently assisting. ${csrEntries.length} CSR responses, ${customerEntries.length} customer messages.`;
  }, []);

  // Main extraction function
  const extractData = useCallback(async () => {
    if (entries.length === 0) return;

    setIsExtracting(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Combine all text
    const fullText = entries.map((e) => e.text).join(" ");

    // Extract customer info
    const customerInfo = extractCustomerInfo(fullText);

    // Extract issue categories
    const issueCategories = extractIssueCategories(fullText);

    // Extract action items
    const allActionItems = entries.flatMap((entry) =>
      extractActionItems(entry.text, entry.speaker)
    );

    // Deduplicate action items
    const uniqueActionItems = allActionItems.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t.text.toLowerCase() === item.text.toLowerCase())
    );

    // Analyze sentiment
    const sentiment = analyzeSentiment(fullText);

    // Generate summary
    const callSummary = generateSummary(entries);

    // Generate tags from categories
    const tags = issueCategories.map((c) => c.category);

    // Calculate overall confidence
    const confidenceScores = [
      customerInfo.confidence,
      ...issueCategories.map((c) => c.confidence),
      ...uniqueActionItems.map((a) => a.confidence),
    ];

    const overallConfidence =
      confidenceScores.length > 0
        ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
        : 0;

    setExtractedData({
      customerInfo,
      issueCategories,
      actionItems: uniqueActionItems.slice(0, 5), // Limit to 5 action items
      callSummary,
      sentiment,
      overallConfidence: Math.round(overallConfidence),
      tags,
    });

    setIsExtracting(false);
  }, [
    entries,
    extractCustomerInfo,
    extractIssueCategories,
    extractActionItems,
    analyzeSentiment,
    generateSummary,
  ]);

  // Re-extract when entries change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      extractData();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [entries, extractData]);

  return {
    extractedData,
    isExtracting,
    refreshExtraction: extractData,
  };
}
