/**
 * Plaid Client Configuration
 *
 * Singleton Plaid API client for bank account linking and data aggregation
 */

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Get environment and credentials
const environmentRaw = process.env.PLAID_ENV || "sandbox";
const environment = environmentRaw as keyof typeof PlaidEnvironments;
const clientId = process.env.PLAID_CLIENT_ID;
const secret = process.env[`PLAID_SECRET_${environmentRaw.toUpperCase()}`];

// Log configuration (without secrets) for debugging
console.log("Plaid configuration:", {
  environment: environmentRaw,
  hasClientId: !!clientId,
  hasSecret: !!secret,
  secretVarName: `PLAID_SECRET_${environmentRaw.toUpperCase()}`,
});

// Validate configuration
if (!clientId) {
  throw new Error("PLAID_CLIENT_ID is not defined in environment variables");
}

if (!secret) {
  throw new Error(
    `PLAID_SECRET_${environmentRaw.toUpperCase()} is not defined in environment variables`
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

// Export singleton Plaid API client
export const plaidClient = new PlaidApi(configuration);

// Export environment for client-side use
export const plaidEnvironment = environment;
