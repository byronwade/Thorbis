const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://togejqdwggezkxahomeh.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is not set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  
  // Try to read from a public table (profiles) using REST
  // This bypasses the Auth service (GoTrue) and goes to PostgREST
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)
    .single();

  if (error) {
    console.error('REST Query Failed:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
  } else {
    console.log('REST Query Successful!');
    console.log('Data:', data);
  }
}

testConnection();
