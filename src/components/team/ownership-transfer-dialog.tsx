"use client";

/**
 * Ownership Transfer Dialog
 *
 * Multi-step confirmation process for transferring company ownership.
 * This is a CRITICAL operation with multiple safeguards.
 *
 * Security features:
 * - 3-step confirmation process
 * - Password verification
 * - Explicit acknowledgment of consequences
 * - Type-to-confirm username
 * - Final irreversible warning
 * - Audit logging
 */

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Lock,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface OwnershipTransferDialogProps {
  /** Whether dialog is open */
  open: boolean;

  /** Close dialog callback */
  onClose: () => void;

  /** Current owner */
  currentOwner: TeamMember;

  /** New owner to transfer to */
  newOwner: TeamMember;

  /** Transfer callback */
  onTransfer: (password: string) => Promise<void>;

  /** Whether transfer is in progress */
  isTransferring?: boolean;
}

type Step = "warnings" | "acknowledgment" | "confirmation";

export function OwnershipTransferDialog({
  open,
  onClose,
  currentOwner,
  newOwner,
  onTransfer,
  isTransferring = false,
}: OwnershipTransferDialogProps) {
  const [step, setStep] = useState<Step>("warnings");
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [acknowledged, setAcknowledged] = useState({
    irreversible: false,
    fullAccess: false,
    loseOwnership: false,
    becomeAdmin: false,
  });

  // Reset state when dialog closes
  const handleClose = () => {
    setStep("warnings");
    setPassword("");
    setConfirmEmail("");
    setAcknowledged({
      irreversible: false,
      fullAccess: false,
      loseOwnership: false,
      becomeAdmin: false,
    });
    onClose();
  };

  // Check if all acknowledgments are checked
  const allAcknowledged = Object.values(acknowledged).every((v) => v);

  // Check if email matches
  const emailMatches = confirmEmail.toLowerCase() === newOwner.email.toLowerCase();

  // Handle transfer
  const handleTransfer = async () => {
    if (!password) return;

    try {
      await onTransfer(password);
      handleClose();
    } catch (error) {
      // Error handled by parent
      console.error("Transfer failed:", error);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && handleClose()} open={open}>
      <DialogContent className="max-w-2xl">
        {/* Step 1: Warnings */}
        {step === "warnings" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">
                    Transfer Company Ownership
                  </DialogTitle>
                  <DialogDescription>
                    This is a critical and irreversible action
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-6">
              {/* Critical Warning */}
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>CRITICAL: Read Carefully</AlertTitle>
                <AlertDescription>
                  Transferring ownership cannot be undone. This action will
                  permanently change the company owner and affect all
                  administrative rights.
                </AlertDescription>
              </Alert>

              {/* Current vs New Owner */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Ownership Change</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Current Owner */}
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge className="bg-red-500" variant="destructive">
                        Current Owner
                      </Badge>
                      <Crown className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={currentOwner.avatar} />
                        <AvatarFallback>
                          {currentOwner.firstName[0]}
                          {currentOwner.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {currentOwner.firstName} {currentOwner.lastName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {currentOwner.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* New Owner */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
                    <div className="mb-3 flex items-center gap-2">
                      <Badge className="bg-green-600" variant="default">
                        New Owner
                      </Badge>
                      <Crown className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={newOwner.avatar} />
                        <AvatarFallback>
                          {newOwner.firstName[0]}
                          {newOwner.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {newOwner.firstName} {newOwner.lastName}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {newOwner.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Will Happen */}
              <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                <Label className="text-base font-semibold">
                  What Will Happen:
                </Label>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <p>
                      <strong>{newOwner.firstName} {newOwner.lastName}</strong>{" "}
                      will become the company owner with full administrative
                      access
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <p>
                      They will have complete control over billing, team
                      management, and all settings
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <p>
                      <strong>You</strong> will be automatically changed to{" "}
                      <Badge variant="secondary">Admin</Badge> role
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <p>You will lose owner-only privileges (billing, ownership transfer)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="font-semibold text-red-600 dark:text-red-400">
                      Only the new owner can transfer ownership back to you
                    </p>
                  </div>
                </div>
              </div>

              {/* Reasons to Transfer */}
              <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                <Label className="text-base font-semibold">
                  Common Reasons for Transfer:
                </Label>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Company ownership change or sale</li>
                  <li>Leadership transition or succession planning</li>
                  <li>Delegating billing responsibilities</li>
                  <li>Business partner changes</li>
                </ul>
                <p className="text-muted-foreground text-xs">
                  If you just need to grant administrative access, consider
                  changing their role to Admin instead.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} type="button" variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("acknowledgment")}
                type="button"
                variant="destructive"
              >
                I Understand, Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 2: Acknowledgment */}
        {step === "acknowledgment" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <UserCheck className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">
                    Confirm Your Understanding
                  </DialogTitle>
                  <DialogDescription>
                    Please acknowledge each point before continuing
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Step 2 of 3</AlertTitle>
                <AlertDescription>
                  Check each box to confirm you understand the consequences
                </AlertDescription>
              </Alert>

              {/* Acknowledgment Checkboxes */}
              <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={acknowledged.irreversible}
                    disabled={isTransferring}
                    id="irreversible"
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        irreversible: checked === true,
                      }))
                    }
                  />
                  <Label className="cursor-pointer leading-relaxed" htmlFor="irreversible">
                    I understand this action is{" "}
                    <strong className="text-red-600 dark:text-red-400">
                      IRREVERSIBLE
                    </strong>{" "}
                    and cannot be undone by me
                  </Label>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={acknowledged.fullAccess}
                    disabled={isTransferring}
                    id="fullAccess"
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        fullAccess: checked === true,
                      }))
                    }
                  />
                  <Label className="cursor-pointer leading-relaxed" htmlFor="fullAccess">
                    I understand{" "}
                    <strong>
                      {newOwner.firstName} {newOwner.lastName}
                    </strong>{" "}
                    will have complete control over the company, including
                    billing and all settings
                  </Label>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={acknowledged.loseOwnership}
                    disabled={isTransferring}
                    id="loseOwnership"
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        loseOwnership: checked === true,
                      }))
                    }
                  />
                  <Label className="cursor-pointer leading-relaxed" htmlFor="loseOwnership">
                    I understand I will{" "}
                    <strong className="text-red-600 dark:text-red-400">
                      LOSE ownership
                    </strong>{" "}
                    and owner-only privileges immediately
                  </Label>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={acknowledged.becomeAdmin}
                    disabled={isTransferring}
                    id="becomeAdmin"
                    onCheckedChange={(checked) =>
                      setAcknowledged((prev) => ({
                        ...prev,
                        becomeAdmin: checked === true,
                      }))
                    }
                  />
                  <Label className="cursor-pointer leading-relaxed" htmlFor="becomeAdmin">
                    I understand I will be changed to <Badge variant="secondary">Admin</Badge> role and
                    only the new owner can transfer ownership back
                  </Label>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <div className="h-2 w-2 rounded-full bg-muted" />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setStep("warnings")}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                disabled={!allAcknowledged || isTransferring}
                onClick={() => setStep("confirmation")}
                type="button"
                variant="destructive"
              >
                Continue to Final Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Step 3: Final Confirmation */}
        {step === "confirmation" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <Lock className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">Final Confirmation</DialogTitle>
                  <DialogDescription>
                    Enter your password and new owner's email to confirm
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-6">
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>FINAL WARNING - Step 3 of 3</AlertTitle>
                <AlertDescription>
                  This is your last chance to cancel. After clicking "Transfer
                  Ownership", the change will be immediate and permanent.
                </AlertDescription>
              </Alert>

              {/* Confirm Email */}
              <div className="space-y-2">
                <Label htmlFor="confirmEmail">
                  Type the new owner's email to confirm:{" "}
                  <code className="rounded bg-muted px-1 text-xs">
                    {newOwner.email}
                  </code>
                </Label>
                <Input
                  autoComplete="off"
                  disabled={isTransferring}
                  id="confirmEmail"
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder={newOwner.email}
                  value={confirmEmail}
                />
                {confirmEmail && !emailMatches && (
                  <p className="text-destructive text-sm">
                    Email does not match. Please type exactly: {newOwner.email}
                  </p>
                )}
              </div>

              {/* Password Verification */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Enter your password to confirm identity:
                </Label>
                <Input
                  autoComplete="current-password"
                  disabled={isTransferring}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your account password"
                  type="password"
                  value={password}
                />
                <p className="text-muted-foreground text-xs">
                  Your password is required to verify this critical action
                </p>
              </div>

              {/* Final Summary */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    You are about to:
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      Transfer ownership to{" "}
                      <strong>
                        {newOwner.firstName} {newOwner.lastName}
                      </strong>
                    </li>
                    <li>Give them complete control of the company</li>
                    <li>Change your role from Owner to Admin</li>
                    <li>Lose the ability to transfer ownership</li>
                  </ul>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div className="h-2 w-2 rounded-full bg-red-500" />
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={isTransferring}
                onClick={() => setStep("acknowledgment")}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                disabled={!emailMatches || !password || isTransferring}
                onClick={handleTransfer}
                type="button"
                variant="destructive"
              >
                {isTransferring ? (
                  <>
                    <Crown className="mr-2 h-4 w-4 animate-pulse" />
                    Transferring Ownership...
                  </>
                ) : (
                  <>
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Transfer Ownership - FINAL
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
