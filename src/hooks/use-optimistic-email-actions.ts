/**
 * Optimistic Email Actions Hook
 * 
 * Uses React 19's useOptimistic for instant UI updates
 * Provides optimistic state management for all email actions
 */

"use client";

import { useOptimistic, useTransition, useEffect, useRef, useCallback } from "react";
import type { CompanyEmail, GetEmailsResult } from "@/actions/email-actions";
import { toast } from "sonner";

type OptimisticEmail = CompanyEmail & {
    _optimistic?: boolean;
    _action?: "star" | "unstar" | "spam" | "unspam" | "archive" | "read";
};

type OptimisticEmailsState = {
    emails: OptimisticEmail[];
    total: number;
    hasMore: boolean;
};

type OptimisticAction =
    | { type: "star"; emailId: string }
    | { type: "unstar"; emailId: string }
    | { type: "spam"; emailId: string }
    | { type: "unspam"; emailId: string }
    | { type: "archive"; emailId: string }
    | { type: "read"; emailId: string }
    | { type: "add"; email: CompanyEmail }
    | { type: "update"; email: CompanyEmail }
    | { type: "replace"; emails: GetEmailsResult };

function applyOptimisticUpdate(
    state: OptimisticEmailsState,
    action: OptimisticAction
): OptimisticEmailsState {
    switch (action.type) {
        case "star": {
            return {
                ...state,
                emails: state.emails.map((email) =>
                    email.id === action.emailId
                        ? {
                              ...email,
                              tags: Array.isArray(email.tags)
                                  ? [...email.tags, "starred"]
                                  : ["starred"],
                              _optimistic: true,
                              _action: "star",
                          }
                        : email
                ),
            };
        }
        case "unstar": {
            return {
                ...state,
                emails: state.emails
                    .map((email) =>
                        email.id === action.emailId
                            ? {
                                  ...email,
                                  tags: Array.isArray(email.tags)
                                      ? email.tags.filter((tag) => tag !== "starred")
                                      : [],
                                  _optimistic: true,
                                  _action: "unstar",
                              }
                            : email
                    )
                    .filter((email) => {
                        // If viewing starred folder, remove unstarred emails
                        const tags = (email.tags as string[]) || [];
                        return tags.includes("starred") || email.id !== action.emailId;
                    }),
            };
        }
        case "spam": {
            return {
                ...state,
                emails: state.emails
                    .map((email) =>
                        email.id === action.emailId
                            ? {
                                  ...email,
                                  tags: Array.isArray(email.tags)
                                      ? [...email.tags, "spam"]
                                      : ["spam"],
                                  category: "spam",
                                  _optimistic: true,
                                  _action: "spam",
                              }
                            : email
                    )
                    .filter((email) => {
                        // If not viewing spam folder, remove spam emails
                        const tags = (email.tags as string[]) || [];
                        return tags.includes("spam") || email.id !== action.emailId;
                    }),
            };
        }
        case "unspam": {
            return {
                ...state,
                emails: state.emails
                    .map((email) =>
                        email.id === action.emailId
                            ? {
                                  ...email,
                                  tags: Array.isArray(email.tags)
                                      ? email.tags.filter((tag) => tag !== "spam")
                                      : [],
                                  category: null,
                                  _optimistic: true,
                                  _action: "unspam",
                              }
                            : email
                    )
                    .filter((email) => {
                        // If viewing spam folder, remove unspammed emails
                        const tags = (email.tags as string[]) || [];
                        return !tags.includes("spam") || email.id !== action.emailId;
                    }),
            };
        }
        case "archive": {
            return {
                ...state,
                emails: state.emails.filter((email) => email.id !== action.emailId),
                total: Math.max(0, state.total - 1),
            };
        }
        case "read": {
            return {
                ...state,
                emails: state.emails.map((email) =>
                    email.id === action.emailId
                        ? {
                              ...email,
                              read_at: new Date().toISOString(),
                              _optimistic: true,
                              _action: "read",
                          }
                        : email
                ),
            };
        }
        case "add": {
            return {
                ...state,
                emails: [action.email, ...state.emails],
                total: state.total + 1,
            };
        }
        case "update": {
            return {
                ...state,
                emails: state.emails.map((email) =>
                    email.id === action.email.id ? action.email : email
                ),
            };
        }
        case "replace": {
            return {
                emails: action.emails.emails,
                total: action.emails.total,
                hasMore: action.emails.hasMore,
            };
        }
        default:
            return state;
    }
}

export function useOptimisticEmailActions(initialEmails: GetEmailsResult | null) {
    const [isPending, startTransition] = useTransition();
    
    // useOptimistic requires a STABLE initial value - always start with empty state
    // We'll sync it with initialEmails via useEffect to prevent hook order issues
    const [optimisticEmails, setOptimisticEmails] = useOptimistic<
        OptimisticEmailsState,
        OptimisticAction
    >(
        {
            emails: [],
            total: 0,
            hasMore: false,
        },
        applyOptimisticUpdate
    );
    
    // Initialize optimistic state with initialEmails when it first becomes available
    // After that, rely entirely on explicit updateEmails() calls
    const hasInitializedRef = useRef(false);
    
    // Sync when initialEmails first becomes available (only once)
    useEffect(() => {
        if (!hasInitializedRef.current && initialEmails) {
            hasInitializedRef.current = true;
            startTransition(() => {
                setOptimisticEmails({ type: "replace", emails: initialEmails });
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialEmails?.emails?.length]); // Only track when emails first appear

    const updateEmails = useCallback((emails: GetEmailsResult) => {
        // Mark as initialized when we explicitly update
        hasInitializedRef.current = true;
        startTransition(() => {
            setOptimisticEmails({ type: "replace", emails });
        });
    }, [setOptimisticEmails, startTransition]);

    const optimisticStar = (emailId: string) => {
        const email = optimisticEmails.emails.find((e) => e.id === emailId);
        const isStarred = email?.tags && Array.isArray(email.tags) && email.tags.includes("starred");

        startTransition(() => {
            setOptimisticEmails({
                type: isStarred ? "unstar" : "star",
                emailId,
            });
        });
    };

    const optimisticToggleSpam = (emailId: string) => {
        const email = optimisticEmails.emails.find((e) => e.id === emailId);
        const tags = (email?.tags as string[]) || [];
        const isSpam = tags.includes("spam") || email?.category === "spam";

        startTransition(() => {
            setOptimisticEmails({
                type: isSpam ? "unspam" : "spam",
                emailId,
            });
        });
    };

    const optimisticArchive = (emailId: string) => {
        startTransition(() => {
            setOptimisticEmails({ type: "archive", emailId });
        });
    };

    const optimisticRead = (emailId: string) => {
        startTransition(() => {
            setOptimisticEmails({ type: "read", emailId });
        });
    };

    const optimisticAdd = (email: CompanyEmail) => {
        startTransition(() => {
            setOptimisticEmails({ type: "add", email });
        });
    };

    const optimisticUpdate = (email: CompanyEmail) => {
        startTransition(() => {
            setOptimisticEmails({ type: "update", email });
        });
    };

    return {
        emails: optimisticEmails,
        isPending,
        updateEmails,
        optimisticStar,
        optimisticToggleSpam,
        optimisticArchive,
        optimisticRead,
        optimisticAdd,
        optimisticUpdate,
    };
}

