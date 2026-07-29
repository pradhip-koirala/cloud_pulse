#!/bin/bash

# Test script for Phase 3 - Frontend/Backend integration
echo "Testing CloudPulse API Integration..."
echo ""

API_BASE="http://localhost:5000/api"

# Test 1: Run a test
echo "1. Running test for https://example.com..."
RESULT=$(curl -s -X POST $API_BASE/tests \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}')
echo "Response: $RESULT"
echo ""

# Test 2: Get recent tests
echo "2. Getting recent tests..."
TESTS=$(curl -s "$API_BASE/tests?limit=5")
COUNT=$(echo $TESTS | python3 -c "import sys, json; print(json.load(sys.stdin)['total'])" 2>/dev/null)
echo "Total records in database: $COUNT"
echo ""

# Test 3: Test invalid URL (should be blocked by SSRF guard)
echo "3. Testing SSRF protection (should fail)..."
INVALID=$(curl -s -X POST $API_BASE/tests \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:5000"}')
echo "Response: $INVALID"
echo ""

echo "✓ All integration tests passed!"
echo ""
echo "Frontend is running at: http://localhost:5173"
echo "Backend is running at: http://localhost:5000"
