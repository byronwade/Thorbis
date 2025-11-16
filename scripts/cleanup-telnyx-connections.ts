/**
 * Cleanup Telnyx Credential Connections
 *
 * Use this script to delete old/zombie WebRTC credential connections
 * when you hit the 5-connection account limit.
 *
 * Usage:
 *   npx tsx scripts/cleanup-telnyx-connections.ts
 *
 * Or to delete ALL connections:
 *   npx tsx scripts/cleanup-telnyx-connections.ts --delete-all
 */

const TELNYX_API_KEY = process.env.TELNYX_API_KEY || process.env.TELNYX_API_SECRET;
const TELNYX_API_URL = "https://api.telnyx.com/v2";

async function listCredentialConnections() {
  const response = await fetch(`${TELNYX_API_URL}/credential_connections`, {
    headers: {
      Authorization: `Bearer ${TELNYX_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to list connections: ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function deleteCredentialConnection(connectionId: string) {
  const response = await fetch(
    `${TELNYX_API_URL}/credential_connections/${connectionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TELNYX_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error(`Failed to delete ${connectionId}:`, error);
    return false;
  }

  return true;
}

async function main() {
  if (!TELNYX_API_KEY) {
    console.error("Error: TELNYX_API_KEY environment variable not set");
    console.error("Set it in .env.local or export it:");
    console.error("  export TELNYX_API_KEY=your_api_key");
    process.exit(1);
  }

  console.log("Fetching Telnyx credential connections...\n");

  const data = await listCredentialConnections();
  const connections = data.data || [];

  console.log(`Found ${connections.length} credential connections:\n`);

  connections.forEach((conn: any, index: number) => {
    console.log(`${index + 1}. ${conn.name || conn.id}`);
    console.log(`   ID: ${conn.id}`);
    console.log(`   Created: ${conn.created_at}`);
    console.log(`   Active: ${conn.active ?? "unknown"}`);
    console.log("");
  });

  if (process.argv.includes("--delete-all")) {
    console.log("\n⚠️  Deleting ALL connections...\n");

    for (const conn of connections) {
      const success = await deleteCredentialConnection(conn.id);
      if (success) {
        console.log(`✅ Deleted: ${conn.name || conn.id}`);
      } else {
        console.log(`❌ Failed to delete: ${conn.name || conn.id}`);
      }
    }

    console.log("\n✅ Cleanup complete!");
    console.log("New connections can now be created.");
  } else {
    console.log("To delete connections, run:");
    console.log("  npx tsx scripts/cleanup-telnyx-connections.ts --delete-all");
    console.log("\nOr delete specific connections via Telnyx Portal:");
    console.log("  https://portal.telnyx.com/#/app/connections");
  }
}

main().catch(console.error);
