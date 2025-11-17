#!/bin/bash

# Test script to verify infinite loop fix
# This script monitors Next.js dev server logs to detect loop behavior

URL="http://localhost:3000/dashboard/work/3890be9f-c191-4725-8e6e-3a35721ed944"
TEST_DURATION=10 # seconds
LOG_FILE="/tmp/nextjs-loop-test-$(date +%s).log"

echo "=== Testing for infinite loops ==="
echo "URL: $URL"
echo "Duration: ${TEST_DURATION}s"
echo "Log file: $LOG_FILE"
echo ""

# Function to count POST requests in logs
count_posts() {
    local file=$1
    grep -c "POST /dashboard/work" "$file" 2>/dev/null || echo "0"
}

# Create temporary log file
touch "$LOG_FILE"

# Make initial request
echo "Making initial request..."
curl -s "$URL" > /dev/null

# Wait a moment for page to settle
sleep 2

# Start counting
echo "Monitoring for ${TEST_DURATION} seconds..."
START_COUNT=$(count_posts "$LOG_FILE")
sleep "$TEST_DURATION"
END_COUNT=$(count_posts "$LOG_FILE")

# Calculate difference
POST_COUNT=$((END_COUNT - START_COUNT))

echo ""
echo "=== Results ==="
echo "POST requests during ${TEST_DURATION}s: $POST_COUNT"

if [ "$POST_COUNT" -gt 5 ]; then
    echo "❌ LOOP DETECTED - More than 5 POST requests"
    echo "   This indicates an infinite loop is still present"
    exit 1
elif [ "$POST_COUNT" -gt 0 ]; then
    echo "⚠️  POTENTIAL ISSUE - $POST_COUNT POST requests detected"
    echo "   Some re-rendering may be occurring"
    exit 2
else
    echo "✅ NO LOOPS - No POST requests detected"
    echo "   Page is stable"
    exit 0
fi
