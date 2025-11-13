"use client";

/**
 * Detail Back Button - Reusable back button component for detail pages
 *
 * Shows a back button with arrow icon and label, navigates to the specified href
 */

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type DetailBackButtonProps = {
  /** The href to navigate to when clicked */
  href: string;
  /** The label text to display on the button */
  label: string;
};

export function DetailBackButton({ href, label }: DetailBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      className="h-8 gap-1.5"
      onClick={() => router.push(href)}
      size="sm"
      variant="outline"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
