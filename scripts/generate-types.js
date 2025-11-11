// Script to generate TypeScript types from Supabase database
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgres://postgres.togejqdwggezkxahomeh:uepQ7vz5dwvvucOG@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

try {
  console.log('Generating TypeScript types from Supabase schema...');

  // Use Supabase CLI to generate types
  const output = execSync(
    `npx supabase@latest gen types typescript --db-url "${connectionString}"`,
    { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
  );

  // Write to types file
  const typesPath = path.join(__dirname, '..', 'src', 'types', 'supabase.ts');
  fs.writeFileSync(typesPath, output);

  console.log('✅ TypeScript types generated successfully!');
  console.log(`   Location: ${typesPath}`);
} catch (error) {
  console.error('❌ Error generating types:', error.message);
  process.exit(1);
}
