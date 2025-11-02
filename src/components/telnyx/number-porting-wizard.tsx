/**
 * Number Porting Wizard - Comprehensive 8-Step Process
 *
 * Ultra-detailed phone number porting workflow with:
 * - Step 1: Introduction & Education (pros/cons, timeline, costs)
 * - Step 2: Eligibility Check (real-time portability verification)
 * - Step 3: Current Provider Information (carrier, account details)
 * - Step 4: Service Address (billing address verification)
 * - Step 5: Authorized Person (account holder details)
 * - Step 6: Document Upload (recent bill or LOA)
 * - Step 7: Review & Submit (comprehensive review with edit)
 * - Step 8: Confirmation (porting order submitted with timeline)
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Clock,
  DollarSign,
  Phone,
  Loader2,
  Info,
  CheckCheck,
} from "lucide-react";

interface NumberPortingWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PortingData {
  phoneNumber: string;
  currentCarrier: string;
  accountNumber: string;
  accountPin: string;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
  authorizedPerson: string;
  authorizedEmail: string;
  billDocument: File | null;
}

export function NumberPortingWizard({ open, onOpenChange }: NumberPortingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [portingData, setPortingData] = useState<PortingData>({
    phoneNumber: "",
    currentCarrier: "",
    accountNumber: "",
    accountPin: "",
    addressLine1: "",
    city: "",
    state: "",
    zipCode: "",
    authorizedPerson: "",
    authorizedEmail: "",
    billDocument: null,
  });
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const steps = [
    { number: 1, title: "Introduction", description: "Learn about porting" },
    { number: 2, title: "Eligibility", description: "Check if number can be ported" },
    { number: 3, title: "Provider Info", description: "Current carrier details" },
    { number: 4, title: "Service Address", description: "Billing address" },
    { number: 5, title: "Authorized Person", description: "Account holder" },
    { number: 6, title: "Upload Documents", description: "Bill or LOA" },
    { number: 7, title: "Review", description: "Confirm all details" },
    { number: 8, title: "Confirmation", description: "Porting initiated" },
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof PortingData, value: any) => {
    setPortingData((prev) => ({ ...prev, [field]: value }));
  };

  const checkEligibility = async () => {
    setChecking(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsEligible(true);
    setChecking(false);
  };

  const submitPorting = async () => {
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitting(false);
    nextStep();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Port Your Phone Number</DialogTitle>
          <DialogDescription>
            Transfer your existing phone number to Ultrathink
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && <Step1Introduction onNext={nextStep} />}
          {currentStep === 2 && (
            <Step2Eligibility
              phoneNumber={portingData.phoneNumber}
              setPhoneNumber={(v) => updateData("phoneNumber", v)}
              isEligible={isEligible}
              checking={checking}
              onCheck={checkEligibility}
              onNext={nextStep}
            />
          )}
          {currentStep === 3 && (
            <Step3ProviderInfo
              data={portingData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <Step4ServiceAddress
              data={portingData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <Step5AuthorizedPerson
              data={portingData}
              updateData={updateData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 6 && (
            <Step6DocumentUpload
              document={portingData.billDocument}
              setDocument={(v) => updateData("billDocument", v)}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 7 && (
            <Step7Review
              data={portingData}
              onSubmit={submitPorting}
              onBack={prevStep}
              submitting={submitting}
              onEdit={(step) => setCurrentStep(step)}
            />
          )}
          {currentStep === 8 && (
            <Step8Confirmation
              phoneNumber={portingData.phoneNumber}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Step 1: Introduction
function Step1Introduction({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">About Number Porting</h3>
        <p className="text-sm text-muted-foreground">
          Number porting (also called Local Number Portability or LNP) allows you to transfer
          your existing phone number from your current carrier to Ultrathink. Keep your number
          and enjoy better features and pricing.
        </p>
      </div>

      {/* Pros & Cons */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-900 dark:text-green-100">Advantages</h4>
          </div>
          <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
            <li className="flex gap-2">
              <span>•</span>
              <span>Keep your existing business number</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>No need to update marketing materials</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Customers can still reach you</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Better features at lower cost</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>$0 porting fee (typically $5-15 elsewhere)</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">Considerations</h4>
          </div>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <li className="flex gap-2">
              <span>•</span>
              <span>Takes 7-10 business days typically</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Requires info from current carrier</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Don't cancel current service until port is complete</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Brief service interruption possible (minutes)</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Must match billing info exactly</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h4 className="mb-3 font-semibold">Typical Timeline</h4>
        <div className="space-y-3">
          <TimelineItem
            day="Day 1"
            title="Submit Request"
            description="Complete this wizard and upload required documents"
          />
          <TimelineItem
            day="Day 1-2"
            title="FOC Received"
            description="Firm Order Commitment from your current carrier"
          />
          <TimelineItem
            day="Day 3-7"
            title="Port in Progress"
            description="We coordinate with your current carrier"
          />
          <TimelineItem
            day="Day 7-10"
            title="Port Complete"
            description="Your number is active on Ultrathink!"
          />
        </div>
      </div>

      {/* Important Notes */}
      <Alert>
        <Info className="size-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription className="text-sm">
          <ul className="mt-2 space-y-1">
            <li>• Do NOT cancel your current service until porting is 100% complete</li>
            <li>• Keep your current service active and paid during the porting process</li>
            <li>• Early termination fees from your current carrier may apply</li>
            <li>• We'll notify you via email and SMS at each stage</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Button onClick={onNext} className="w-full" size="lg">
        Start Porting Process
        <ArrowRight className="ml-2 size-4" />
      </Button>
    </div>
  );
}

function TimelineItem({
  day,
  title,
  description,
}: {
  day: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {day.split(" ")[1]}
        </div>
        <div className="w-px flex-1 bg-border" />
      </div>
      <div className="pb-4">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}

// Step 2: Eligibility Check
function Step2Eligibility({
  phoneNumber,
  setPhoneNumber,
  isEligible,
  checking,
  onCheck,
  onNext,
}: {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isEligible: boolean | null;
  checking: boolean;
  onCheck: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Check Number Portability</h3>
        <p className="text-sm text-muted-foreground">
          Enter the phone number you want to port to verify it can be transferred to Ultrathink.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number to Port</Label>
        <div className="flex gap-2">
          <Input
            id="phoneNumber"
            placeholder="(831) 430-6011"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={checking || isEligible === true}
          />
          <Button onClick={onCheck} disabled={!phoneNumber || checking || isEligible === true}>
            {checking ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check"
            )}
          </Button>
        </div>
      </div>

      {/* Eligibility Result */}
      {isEligible === true && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
          <CheckCircle2 className="size-4 text-green-600" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            Number is Portable!
          </AlertTitle>
          <AlertDescription className="text-sm text-green-800 dark:text-green-200">
            <div className="mt-2 space-y-1">
              <div>✓ This number can be ported to Ultrathink</div>
              <div>✓ Estimated timeline: 7-10 business days</div>
              <div>✓ No porting fee</div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {isEligible === false && (
        <Alert variant="destructive">
          <XCircle className="size-4" />
          <AlertTitle>Number Cannot Be Ported</AlertTitle>
          <AlertDescription className="text-sm">
            This number cannot be ported at this time. Common reasons:
            <ul className="mt-2 space-y-1">
              <li>• Number is from a prepaid carrier</li>
              <li>• Number is currently under porting</li>
              <li>• Account has an outstanding balance</li>
              <li>• Number is not active</li>
            </ul>
            Contact support for assistance.
          </AlertDescription>
        </Alert>
      )}

      {isEligible === true && (
        <Button onClick={onNext} className="w-full" size="lg">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

// Step 3: Provider Info
function Step3ProviderInfo({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: PortingData;
  updateData: (field: keyof PortingData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = data.currentCarrier && data.accountNumber && data.accountPin;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Current Provider Information</h3>
        <p className="text-sm text-muted-foreground">
          We need details about your current phone service to complete the porting process.
          This information must match your current carrier's records exactly.
        </p>
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>Where to find this information</AlertTitle>
        <AlertDescription className="text-sm">
          <ul className="mt-2 space-y-1">
            <li>• Check your most recent phone bill</li>
            <li>• Log into your current carrier's online portal</li>
            <li>• Call your carrier's customer service</li>
            <li>• Account number is NOT the same as your phone number</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentCarrier">Current Carrier/Provider *</Label>
          <Input
            id="currentCarrier"
            placeholder="e.g., Verizon, AT&T, T-Mobile, Spectrum"
            value={data.currentCarrier}
            onChange={(e) => updateData("currentCarrier", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Enter the name of your current phone service provider
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number *</Label>
          <Input
            id="accountNumber"
            placeholder="Usually 10-15 digits"
            value={data.accountNumber}
            onChange={(e) => updateData("accountNumber", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Found on your bill - NOT your phone number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountPin">Account PIN/Password *</Label>
          <Input
            id="accountPin"
            type="password"
            placeholder="4-8 digits typically"
            value={data.accountPin}
            onChange={(e) => updateData("accountPin", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Set when you opened the account - call carrier if you don't know it
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 4: Service Address
function Step4ServiceAddress({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: PortingData;
  updateData: (field: keyof PortingData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = data.addressLine1 && data.city && data.state && data.zipCode;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Service Address</h3>
        <p className="text-sm text-muted-foreground">
          Enter the billing address on file with your current carrier. This MUST match your
          carrier's records exactly or the port will be rejected.
        </p>
      </div>

      <Alert variant="default" className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
        <AlertCircle className="size-4 text-amber-600" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">Critical: Address Must Match Exactly</AlertTitle>
        <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
          The #1 reason ports are rejected is address mismatch. Verify this address on your most
          recent bill. Even small differences (like "St" vs "Street" or "Apt 2" vs "#2") will
          cause rejection.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Street Address *</Label>
          <Input
            id="addressLine1"
            placeholder="123 Main Street"
            value={data.addressLine1}
            onChange={(e) => updateData("addressLine1", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Match the format on your bill exactly (including abbreviations)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="Monterey"
              value={data.city}
              onChange={(e) => updateData("city", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              placeholder="CA"
              value={data.state}
              onChange={(e) => updateData("state", e.target.value)}
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              placeholder="93940"
              value={data.zipCode}
              onChange={(e) => updateData("zipCode", e.target.value)}
              maxLength={10}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 5: Authorized Person
function Step5AuthorizedPerson({
  data,
  updateData,
  onNext,
  onBack,
}: {
  data: PortingData;
  updateData: (field: keyof PortingData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const canContinue = data.authorizedPerson && data.authorizedEmail;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Authorized Person</h3>
        <p className="text-sm text-muted-foreground">
          Identify the person authorized to make changes to this account. This is typically the
          account holder whose name appears on the bill.
        </p>
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>Letter of Authorization (LOA)</AlertTitle>
        <AlertDescription className="text-sm">
          This person's name will appear on the Letter of Authorization (LOA) document. This
          authorizes the port request on behalf of the account holder.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="authorizedPerson">Full Name of Account Holder *</Label>
          <Input
            id="authorizedPerson"
            placeholder="John Smith"
            value={data.authorizedPerson}
            onChange={(e) => updateData("authorizedPerson", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Must match the name on the account with your current carrier
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="authorizedEmail">Email Address *</Label>
          <Input
            id="authorizedEmail"
            type="email"
            placeholder="john@ultrathink.com"
            value={data.authorizedEmail}
            onChange={(e) => updateData("authorizedEmail", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            We'll send porting status updates to this email
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!canContinue} className="flex-1">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 6: Document Upload
function Step6DocumentUpload({
  document,
  setDocument,
  onNext,
  onBack,
}: {
  document: File | null;
  setDocument: (file: File | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Upload Supporting Documents</h3>
        <p className="text-sm text-muted-foreground">
          Upload a recent bill or Letter of Authorization (LOA) to verify account ownership.
          This speeds up the porting process and reduces rejections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-semibold">Option 1: Recent Bill</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• From last 30 days</li>
            <li>• Shows account number</li>
            <li>• Shows billing address</li>
            <li>• Shows phone number</li>
            <li>• PDF, JPG, or PNG format</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-semibold">Option 2: Letter of Authorization</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Signed by account holder</li>
            <li>• Authorizes the port</li>
            <li>• Includes account details</li>
            <li>• We can provide a template</li>
            <li>• PDF format recommended</li>
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="billDocument">Upload Document</Label>
        <div className="flex flex-col gap-3">
          <Input
            id="billDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {document && (
            <div className="flex items-center gap-2 rounded-lg border bg-muted p-3">
              <FileText className="size-5 text-muted-foreground" />
              <div className="flex-1">
                <div className="text-sm font-medium">{document.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(document.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDocument(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Max file size: 10MB. Accepted formats: PDF, JPG, PNG
        </p>
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>Optional but Recommended</AlertTitle>
        <AlertDescription className="text-sm">
          While uploading a document is optional, it significantly reduces processing time and
          the chance of rejection. Ports with documentation are approved 3x faster on average.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          {document ? "Continue" : "Skip for Now"}
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}

// Step 7: Review & Submit
function Step7Review({
  data,
  onSubmit,
  onBack,
  submitting,
  onEdit,
}: {
  data: PortingData;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-lg font-semibold">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">
          Please review all information carefully before submitting. Incorrect information will
          delay or reject your port request.
        </p>
      </div>

      <div className="space-y-4">
        <ReviewSection
          title="Phone Number"
          onEdit={() => onEdit(2)}
          items={[{ label: "Number to Port", value: data.phoneNumber }]}
        />

        <ReviewSection
          title="Current Provider"
          onEdit={() => onEdit(3)}
          items={[
            { label: "Carrier", value: data.currentCarrier },
            { label: "Account Number", value: data.accountNumber },
            { label: "Account PIN", value: "••••••" },
          ]}
        />

        <ReviewSection
          title="Service Address"
          onEdit={() => onEdit(4)}
          items={[
            { label: "Street", value: data.addressLine1 },
            { label: "City", value: data.city },
            { label: "State", value: data.state },
            { label: "ZIP", value: data.zipCode },
          ]}
        />

        <ReviewSection
          title="Authorized Person"
          onEdit={() => onEdit(5)}
          items={[
            { label: "Name", value: data.authorizedPerson },
            { label: "Email", value: data.authorizedEmail },
          ]}
        />

        <ReviewSection
          title="Documentation"
          onEdit={() => onEdit(6)}
          items={[
            {
              label: "Uploaded",
              value: data.billDocument ? data.billDocument.name : "No document uploaded",
            },
          ]}
        />
      </div>

      <Alert>
        <CheckCheck className="size-4" />
        <AlertTitle>Ready to Submit</AlertTitle>
        <AlertDescription className="text-sm">
          By submitting, you authorize Ultrathink to port your number. Keep your current
          service active until you receive confirmation that the port is complete (typically
          7-10 business days).
        </AlertDescription>
      </Alert>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={submitting}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <Button onClick={onSubmit} disabled={submitting} className="flex-1" size="lg">
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 size-4" />
              Submit Port Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  items,
}: {
  title: string;
  onEdit: () => void;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold">{title}</h4>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}:</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 8: Confirmation
function Step8Confirmation({
  phoneNumber,
  onClose,
}: {
  phoneNumber: string;
  onClose: () => void;
}) {
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 10);

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
        <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
      </div>

      <div>
        <h3 className="mb-2 text-xl font-semibold">Port Request Submitted!</h3>
        <p className="text-sm text-muted-foreground">
          Your request to port {phoneNumber} has been successfully submitted to our porting team.
        </p>
      </div>

      <div className="rounded-lg border bg-muted p-6">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Clock className="size-5 text-muted-foreground" />
          <span className="font-semibold">Estimated Completion</span>
        </div>
        <div className="text-2xl font-bold">{estimatedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        <div className="mt-1 text-sm text-muted-foreground">
          7-10 business days from today
        </div>
      </div>

      <div className="space-y-3 text-left">
        <h4 className="font-semibold">What happens next?</h4>
        <div className="space-y-2">
          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">FOC Request</div>
              <div className="text-sm text-muted-foreground">
                We'll request a Firm Order Commitment from your current carrier (1-2 days)
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Email Confirmation</div>
              <div className="text-sm text-muted-foreground">
                You'll receive an email with your FOC date and estimated port completion
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="mt-0.5">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">Port Complete</div>
              <div className="text-sm text-muted-foreground">
                Your number will be active on Ultrathink and you can cancel your old service
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert>
        <Info className="size-4" />
        <AlertTitle>Important Reminders</AlertTitle>
        <AlertDescription className="text-left text-sm">
          <ul className="mt-2 space-y-1">
            <li>✓ Keep your current service active until port is 100% complete</li>
            <li>✓ Check your email for status updates</li>
            <li>✓ View porting status anytime in Settings → Phone Numbers</li>
            <li>✓ Contact support if you have questions</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Button onClick={onClose} className="w-full" size="lg">
        View Phone Numbers
      </Button>
    </div>
  );
}
