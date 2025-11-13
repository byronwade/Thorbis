/**
 * Plaid Link Button Component
 *
 * Reusable button for linking bank accounts via Plaid Link
 */

"use client";

import { Building2, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { createPlaidLinkToken, exchangePlaidToken } from "@/actions/plaid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PlaidLinkButtonProps {
  companyId: string;
  onSuccess?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function PlaidLinkButton({
  companyId,
  onSuccess,
  variant = "default",
  size = "default",
  className,
  children,
}: PlaidLinkButtonProps) {
  const { toast } = useToast();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);
  const componentId = useRef(`plaid-${Date.now()}-${Math.random()}`);

  // Fetch link token on mount (only once)
  useEffect(() => {
    if (hasInitialized.current) {
      console.log(
        `[PlaidLinkButton ${componentId.current}] Already initialized, skipping`
      );
      return;
    }

    hasInitialized.current = true;
    console.log(`[PlaidLinkButton ${componentId.current}] Initializing...`);

    async function fetchLinkToken() {
      console.log(
        `[PlaidLinkButton ${componentId.current}] Fetching link token for company:`,
        companyId
      );
      try {
        const result = await createPlaidLinkToken(companyId);
        const errorMsg = result.success
          ? undefined
          : result.error || "Unknown error";
        console.log(
          `[PlaidLinkButton ${componentId.current}] Link token result:`,
          {
            success: result.success,
            hasData: result.success ? !!result.data : false,
            error: errorMsg
          }
        );

        if (result.success && result.data?.linkToken) {
          console.log(
            `[PlaidLinkButton ${componentId.current}] Link token created successfully`
          );
          setLinkToken(result.data.linkToken);
        } else {
          console.error(
            `[PlaidLinkButton ${componentId.current}] Failed to create link token:`,
            errorMsg
          );
          toast.error(errorMsg || "Failed to initialize bank connection");
        }
      } catch (error) {
        console.error(
          `[PlaidLinkButton ${componentId.current}] Error fetching link token:`,
          error
        );
        toast.error("Failed to initialize bank connection");
      }
    }

    fetchLinkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      console.log(
        `[PlaidLinkButton ${componentId.current}] Plaid Link success, exchanging token...`
      );
      setIsLoading(true);
      try {
        const result = await exchangePlaidToken(
          publicToken,
          companyId,
          metadata
        );

        if (result.success && result.data) {
          toast.success(
            `Successfully linked ${result.data.accountsLinked} bank account${
              result.data.accountsLinked > 1 ? "s" : ""
            }`
          );
          onSuccess?.();
        } else {
          const errorMsg = result.success
            ? "Unknown error"
            : result.error || "Unknown error";
          toast.error(errorMsg);
        }
      } catch (error) {
        console.error(
          `[PlaidLinkButton ${componentId.current}] Error exchanging token:`,
          error
        );
        toast.error("Failed to link bank account");
      } finally {
        setIsLoading(false);
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error(
          `[PlaidLinkButton ${componentId.current}] Plaid Link exit error:`,
          err
        );
        toast.error("Bank connection was cancelled or failed");
      }
    },
  });

  // Expose open function for debugging
  useEffect(() => {
    if (open && ready) {
      console.log(
        `[PlaidLinkButton ${componentId.current}] Exposing open function to window.plaidOpen`
      );
      (window as any).plaidOpen = open;
      (window as any).plaidInfo = {
        ready,
        hasToken: !!linkToken,
        componentId: componentId.current,
      };
    }
  }, [open, ready, linkToken]);

  console.log(`[PlaidLinkButton ${componentId.current}] Plaid Link state:`, {
    ready,
    hasToken: !!linkToken,
    isLoading,
    openType: typeof open,
  });

  const handleClick = () => {
    console.log(
      `[PlaidLinkButton ${componentId.current}] Button clicked, opening Plaid Link...`,
      { ready, hasToken: !!linkToken, openType: typeof open }
    );
    if (ready && linkToken) {
      try {
        console.log(
          `[PlaidLinkButton ${componentId.current}] Calling open()... Function:`,
          open
        );
        open();
        console.log(
          `[PlaidLinkButton ${componentId.current}] open() called successfully`
        );
      } catch (error) {
        console.error(
          `[PlaidLinkButton ${componentId.current}] Error calling open():`,
          error
        );
        toast.error(
          "Failed to open bank connection dialog. Please refresh the page and try again."
        );
      }
    } else {
      console.warn(
        `[PlaidLinkButton ${componentId.current}] Cannot open Plaid Link - not ready or no token`,
        { ready, hasToken: !!linkToken }
      );
      toast.info(
        "Bank connection is still initializing. Please wait a moment and try again."
      );
    }
  };

  return (
    <Button
      className={className}
      data-plaid-link-button
      disabled={!ready || isLoading}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
    >
      {isLoading ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Building2 className="mr-2 size-4" />
      )}
      {children || "Connect Bank Account"}
    </Button>
  );
}
