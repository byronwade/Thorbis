// Quick performance diagnostic test
// Run with: node test-performance.js

const testDatabaseSpeed = async () => {
  const startTotal = Date.now();

  console.log('Testing Supabase connection speed...\n');

  const { createClient } = await import('@supabase/supabase-js');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Test 1: Simple query
  const start1 = Date.now();
  const { data: test1 } = await supabase.from('customers').select('id').limit(1);
  const time1 = Date.now() - start1;
  console.log(`✓ Simple query (1 row): ${time1}ms`);

  // Test 2: Query with filter
  const start2 = Date.now();
  const { data: test2 } = await supabase.from('team_members').select('id').limit(10);
  const time2 = Date.now() - start2;
  console.log(`✓ Team members query: ${time2}ms`);

  // Test 3: Query with JOIN
  const start3 = Date.now();
  const { data: test3 } = await supabase
    .from('schedules')
    .select('*, customers(id, first_name)')
    .limit(10);
  const time3 = Date.now() - start3;
  console.log(`✓ Query with JOIN: ${time3}ms`);

  // Test 4: RPC function
  const start4 = Date.now();
  const { data: test4, error: error4 } = await supabase.rpc('get_customers_last_jobs', {
    company_id_param: test2?.[0]?.company_id
  });
  const time4 = Date.now() - start4;
  console.log(`✓ RPC function: ${time4}ms ${error4 ? `(ERROR: ${error4.message})` : ''}`);

  const totalTime = Date.now() - startTotal;
  console.log(`\nTotal test time: ${totalTime}ms`);
  console.log(`Average query time: ${Math.round((time1 + time2 + time3 + time4) / 4)}ms`);

  if (time1 > 500 || time2 > 500 || time3 > 1000) {
    console.log('\n⚠️  WARNING: Database is SLOW!');
    console.log('This suggests network latency or Supabase performance issues.');
    console.log('Expected: <100ms for simple queries, <300ms for JOINs');
  } else {
    console.log('\n✅ Database performance is GOOD');
    console.log('The slowness must be in the application code, not the database.');
  }
};

testDatabaseSpeed().catch(console.error);
