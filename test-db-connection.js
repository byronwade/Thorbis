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
  
  // Try to read from auth.users (requires service role)
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });

  if (error) {
    console.error('Connection Failed:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
  } else {
    console.log('Connection Successful!');
    console.log('Found users:', data.users.length);
  }
}

testConnection();
