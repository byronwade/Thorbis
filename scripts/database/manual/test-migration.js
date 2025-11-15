const { createClient } = require("@supabase/supabase-js");

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://togejqdwggezkxahomeh.supabase.co";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2VqcWR3Z2dlemt4YWhvbWVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTcyMDI5NSwiZXhwIjoyMDc3Mjk2Mjk1fQ.AYOqqzsx3hqzfVa9knQtW6fVnH1K7z-YlmYyBKLCO7E";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMigration() {
  console.log("Testing RBAC migration...\n");

  // Test 1: Check if role column exists
  console.log("1. Checking if role column exists in team_members...");
  const { data: columns, error: colError } = await supabase
    .from("team_members")
    .select("id, role, permissions, department, job_title")
    .limit(1);

  if (colError) {
    console.log("❌ Role column does NOT exist");
    console.log("Error:", colError.message);
    console.log("\n⚠️  MIGRATIONS HAVE NOT BEEN APPLIED!\n");
    return false;
  }

  console.log("✅ Role column exists!");
  console.log("Sample data:", columns);

  // Test 2: Check if user_role enum exists
  console.log("\n2. Checking if user_role enum type exists...");
  const { error: enumError } = await supabase.rpc("has_role", {
    user_uuid: "00000000-0000-0000-0000-000000000000",
    required_role: "owner",
    company_uuid: "00000000-0000-0000-0000-000000000000",
  });

  if (enumError) {
    console.log("❌ has_role function does NOT exist");
    console.log("Error:", enumError.message);
    return false;
  }

  console.log("✅ has_role function exists!");

  // Test 3: Check if ownership_transfers table exists
  console.log("\n3. Checking if ownership_transfers table exists...");
  const { error: transferError } = await supabase
    .from("ownership_transfers")
    .select("id")
    .limit(1);

  if (transferError) {
    console.log("❌ ownership_transfers table does NOT exist");
    console.log("Error:", transferError.message);
    console.log("\n⚠️  OWNER PROTECTIONS MIGRATION HAS NOT BEEN APPLIED!\n");
    return false;
  }

  console.log("✅ ownership_transfers table exists!");

  console.log("\n✅ ALL MIGRATIONS HAVE BEEN APPLIED SUCCESSFULLY!\n");
  return true;
}

testMigration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
