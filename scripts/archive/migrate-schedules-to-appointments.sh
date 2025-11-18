#!/bin/bash

# Migration script: Update all code references from schedules to appointments
# Run from project root: bash scripts/migrate-schedules-to-appointments.sh

echo "Starting migration of schedules → appointments in code..."

# Find all TypeScript and TSX files
FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*")

# Counter
UPDATED=0

for file in $FILES; do
  # Check if file contains "schedules" references
  if grep -q 'from("schedules")' "$file" 2>/dev/null; then
    echo "Updating: $file"

    # Replace .from("schedules") with .from("appointments")
    sed -i.bak 's/from("schedules")/from("appointments")/g' "$file"

    # Replace Tables["schedules"] with Tables["appointments"]
    sed -i.bak 's/Tables\["schedules"\]/Tables["appointments"]/g' "$file"

    # Replace schedules_assigned_to with appointments_assigned_to in foreign key references
    sed -i.bak 's/schedules_assigned_to_users_id_fk/appointments_assigned_to_users_id_fk/g' "$file"

    # Remove backup file
    rm -f "$file.bak"

    ((UPDATED++))
  fi
done

echo ""
echo "✅ Migration complete!"
echo "📊 Updated $UPDATED files"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test the application"
echo "3. Commit changes: git add . && git commit -m 'refactor: migrate schedules table to appointments'"
