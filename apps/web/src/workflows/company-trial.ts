import { sleep } from "workflow";
import {
	DEFAULT_TRIAL_LENGTH_DAYS,
	ensureCompanyTrialStatus,
	expireCompanyTrialIfEligible,
} from "@/lib/payments/trial-management";

export type CompanyTrialWorkflowInput = {
	companyId: string;
	trialLengthDays?: number;
};

export async function companyTrialWorkflow({
	companyId,
	trialLengthDays = DEFAULT_TRIAL_LENGTH_DAYS,
}: CompanyTrialWorkflowInput) {
	"use workflow";

	await markTrialStarted(companyId, trialLengthDays);

	await sleep(`${trialLengthDays}d`);

	await expireTrial(companyId);
}

async function markTrialStarted(companyId: string, trialLengthDays: number) {
	"use step";
	await ensureCompanyTrialStatus({ companyId, trialLengthDays });
}

async function expireTrial(companyId: string) {
	"use step";
	await expireCompanyTrialIfEligible({ companyId });
}
