/**
 * useAIExtraction Hook
 *
 * Custom hook for AI-powered data extraction from call transcripts
 *
 * Features:
 * - Extract customer information (name, email, phone, company, address)
 * - Extract job details (title, description, urgency, type)
 * - Extract appointment needs (date, time, duration)
 * - Real-time streaming extraction using Vercel AI SDK
 * - Confidence scoring for each field
 */

import { useCallback, useEffect, useState } from "react";
import { useTranscriptStore } from "@/lib/stores/transcript-store";

export type AIExtractedData = {
  customerInfo: {
    name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    address: {
      street: string | null;
      city: string | null;
      state: string | null;
      zipCode: string | null;
      full: string | null;
    };
    confidence: number;
  };
  jobDetails: {
    title: string | null;
    description: string | null;
    urgency: "low" | "normal" | "high" | "emergency" | null;
    type: string | null;
    estimatedDuration: number | null;
    confidence: number;
  };
  appointmentNeeds: {
    preferredDate: string | null;
    preferredTime: string | null;
    timePreference: "morning" | "afternoon" | "evening" | "anytime" | null;
    duration: number | null;
    specialRequirements: string | null;
    confidence: number;
  };
  callSummary: string;
  sentiment: "positive" | "neutral" | "negative";
  tags: string[];
  overallConfidence: number;
};

const INITIAL_DATA: AIExtractedData = {
  customerInfo: {
    name: null,
    email: null,
    phone: null,
    company: null,
    address: {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      full: null,
    },
    confidence: 0,
  },
  jobDetails: {
    title: null,
    description: null,
    urgency: null,
    type: null,
    estimatedDuration: null,
    confidence: 0,
  },
  appointmentNeeds: {
    preferredDate: null,
    preferredTime: null,
    timePreference: null,
    duration: null,
    specialRequirements: null,
    confidence: 0,
  },
  callSummary: "",
  sentiment: "neutral",
  tags: [],
  overallConfidence: 0,
};

export function useAIExtraction() {
  const entries = useTranscriptStore((state) => state.entries);
  const [extractedData, setExtractedData] =
    useState<AIExtractedData>(INITIAL_DATA);
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtractedLength, setLastExtractedLength] = useState(0);

  // Main extraction function using AI
  const extractData = useCallback(async () => {
    if (entries.length === 0) {
      setExtractedData(INITIAL_DATA);
      return;
    }

    // Only extract if we have new transcript entries
    if (entries.length === lastExtractedLength) return;

    setIsExtracting(true);

    try {
      // Format transcript for AI
      const formattedTranscript = entries.map((entry) => ({
        speaker: entry.speaker,
        text: entry.text,
        timestamp: entry.timestamp,
      }));

      // Call AI extraction API
      const response = await fetch("/api/ai/extract-call-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: formattedTranscript,
          mode: lastExtractedLength > 0 ? "update" : "full",
          previousExtraction: lastExtractedLength > 0 ? extractedData : null,
        }),
      });

      if (!response.ok) {
        throw new Error("AI extraction failed");
      }

      // Read the streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
        }
      }

      // Parse the AI response
      // The response is in data stream format, extract the JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);

        // Calculate overall confidence
        const confidences = [
          parsed.customerInfo?.confidence || 0,
          parsed.jobDetails?.confidence || 0,
          parsed.appointmentNeeds?.confidence || 0,
        ];
        const overallConfidence =
          confidences.reduce((a, b) => a + b, 0) / confidences.length;

        setExtractedData({
          customerInfo: {
            ...INITIAL_DATA.customerInfo,
            ...parsed.customerInfo,
          },
          jobDetails: {
            ...INITIAL_DATA.jobDetails,
            ...parsed.jobDetails,
          },
          appointmentNeeds: {
            ...INITIAL_DATA.appointmentNeeds,
            ...parsed.appointmentNeeds,
          },
          callSummary: parsed.callSummary || "",
          sentiment: parsed.sentiment || "neutral",
          tags: parsed.tags || [],
          overallConfidence: Math.round(overallConfidence),
        });

        setLastExtractedLength(entries.length);
      }
    } catch (error) {
      console.error("AI extraction error:", error);
      // Fall back to previous data on error
    } finally {
      setIsExtracting(false);
    }
  }, [entries, lastExtractedLength, extractedData]);

  // Re-extract when entries change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      extractData();
    }, 2000); // 2 second debounce for cost optimization

    return () => clearTimeout(timer);
  }, [entries, extractData]);

  return {
    extractedData,
    isExtracting,
    refreshExtraction: extractData,
  };
}
