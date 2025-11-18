/**
 * Plaid Client Configuration
 *
 * Singleton Plaid API client for bank account linking and data aggregation
 */

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

let _plaidClient: PlaidApi | null = null;
let _plaidEnvironment: keyof typeof PlaidEnvironments | null = null;

function initializePlaidClient() {
	if (_plaidClient) return;

	// Get environment and credentials
	const environmentRaw = process.env.PLAID_ENV || "sandbox";
	const environment = environmentRaw as keyof typeof PlaidEnvironments;
	const clientId = process.env.PLAID_CLIENT_ID;
	const secret = process.env[`PLAID_SECRET_${environmentRaw.toUpperCase()}`];

	// Validate configuration
	if (!clientId) {
		throw new Error("PLAID_CLIENT_ID is not defined in environment variables");
	}

	if (!secret) {
		throw new Error(
			`PLAID_SECRET_${environmentRaw.toUpperCase()} is not defined in environment variables`,
		);
	}

	// Create Plaid configuration
	const configuration = new Configuration({
		basePath: PlaidEnvironments[environment],
		baseOptions: {
			headers: {
				"PLAID-CLIENT-ID": clientId,
				"PLAID-SECRET": secret,
			},
		},
	});

	_plaidClient = new PlaidApi(configuration);
	_plaidEnvironment = environment;
}

// Lazy getters that initialize on first access
export function getPlaidClient(): PlaidApi {
	if (!_plaidClient) {
		initializePlaidClient();
	}
	return _plaidClient!;
}

export function getPlaidEnvironment(): keyof typeof PlaidEnvironments {
	if (!_plaidEnvironment) {
		initializePlaidClient();
	}
	return _plaidEnvironment!;
}

// Export legacy names for backward compatibility
export const plaidClient = new Proxy({} as PlaidApi, {
	get(_target, prop) {
		return (getPlaidClient() as any)[prop];
	},
});

export const plaidEnvironment = new Proxy(
	{} as keyof typeof PlaidEnvironments,
	{
		get() {
			return getPlaidEnvironment();
		},
	},
);
