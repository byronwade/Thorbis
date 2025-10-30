#!/bin/bash

echo "🚀 Running Supabase migrations..."
echo ""

# Read environment variables
source .env.local

# Check if Supabase URL is set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
  exit 1
fi

echo "✅ Connected to: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Install supabase CLI if not installed
if ! command -v supabase &> /dev/null; then
  echo "📦 Installing Supabase CLI..."
  brew install supabase/tap/supabase
fi

# Link to remote project
echo "🔗 Linking to Supabase project..."
echo ""
echo "Please enter your Supabase project ref (from URL: https://[REF].supabase.co)"
read -p "Project ref: " project_ref

if [ -z "$project_ref" ]; then
  echo "❌ Error: Project ref is required"
  exit 1
fi

# Link project
supabase link --project-ref "$project_ref"

# Run migrations
echo ""
echo "📋 Running migrations..."
supabase db push

echo ""
echo "✅ Migrations complete!"
echo ""
echo "🎉 Your database is now ready with:"
echo "  - Row Level Security (RLS) on all tables"
echo "  - Storage buckets configured"
echo "  - Authentication ready"
echo ""
echo "Next step: Test authentication at http://localhost:3000/register"
