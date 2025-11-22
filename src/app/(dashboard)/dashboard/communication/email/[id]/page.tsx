/**
 * Email Detail Page
 * Route: /dashboard/communication/email/[id]?folder=inbox
 * 
 * Redirects to query parameter version for instant loading
 * This route exists for sharing/bookmarking purposes
 */

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailId = params?.id as string;
    const folder = searchParams.get("folder") || "inbox";

    // Convert path param to query param for instant loading (no page refresh)
    useEffect(() => {
        if (emailId) {
            const queryParams = new URLSearchParams();
            if (folder && folder !== "inbox") queryParams.set("folder", folder);
            queryParams.set("id", emailId);
            // Use replace to avoid adding to history and prevent page refresh
            router.replace(`/dashboard/communication/email?${queryParams.toString()}`, { scroll: false });
        }
    }, [emailId, folder, router]);

    // Show nothing while redirecting (instant)
    return null;
}
