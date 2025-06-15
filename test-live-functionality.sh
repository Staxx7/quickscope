#!/bin/bash

# QuickScope Live Functionality Test Script
# This script tests all accessible endpoints and functionality

echo "========================================="
echo "QuickScope Platform Live Testing"
echo "========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="https://quickscope.info"

# Function to test endpoint
test_endpoint() {
    local url=$1
    local method=${2:-GET}
    local data=${3:-""}
    local expected=${4:-200}
    
    echo -n "Testing: $method $url ... "
    
    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected" ]; then
        echo -e "${GREEN}✓ $http_code${NC}"
        return 0
    else
        echo -e "${RED}✗ $http_code (expected $expected)${NC}"
        return 1
    fi
}

echo "1. Testing Public Pages"
echo "----------------------"
test_endpoint "$BASE_URL" "GET" "" "200"
test_endpoint "$BASE_URL/connect" "GET" "" "200"
test_endpoint "$BASE_URL/success" "GET" "" "200"

echo ""
echo "2. Testing API Endpoints (May require auth)"
echo "------------------------------------------"
test_endpoint "$BASE_URL/api/admin/connected-companies" "GET" "" "307"
test_endpoint "$BASE_URL/api/market-intelligence?industry=technology" "GET" "" "307"
test_endpoint "$BASE_URL/api/export/audit-deck" "POST" '{"deck":{"metadata":{"companyName":"Test"}},"format":"pdf"}' "307"

echo ""
echo "3. Testing OAuth Endpoints"
echo "-------------------------"
test_endpoint "$BASE_URL/api/qbo/callback" "GET" "" "307"
test_endpoint "$BASE_URL/api/qbo/auth" "GET" "" "307"

echo ""
echo "4. Testing Admin Routes"
echo "----------------------"
test_endpoint "$BASE_URL/dashboard" "GET" "" "307"
test_endpoint "$BASE_URL/admin/prospects" "GET" "" "307"

echo ""
echo "5. Testing Static Assets"
echo "-----------------------"
# Check if Next.js static files are accessible
curl -s "$BASE_URL" | grep -q "_next/static" && echo -e "${GREEN}✓ Next.js static assets found${NC}" || echo -e "${RED}✗ No static assets found${NC}"

echo ""
echo "6. Testing Response Headers"
echo "--------------------------"
echo "Checking security headers..."
headers=$(curl -s -I "$BASE_URL")
echo "$headers" | grep -qi "x-frame-options" && echo -e "${GREEN}✓ X-Frame-Options present${NC}" || echo -e "${YELLOW}⚠ X-Frame-Options missing${NC}"
echo "$headers" | grep -qi "content-security-policy" && echo -e "${GREEN}✓ CSP present${NC}" || echo -e "${YELLOW}⚠ CSP missing${NC}"

echo ""
echo "7. API Response Analysis"
echo "-----------------------"
echo "Testing market intelligence API structure..."
response=$(curl -s "$BASE_URL/api/market-intelligence?industry=technology")
if echo "$response" | grep -q "Redirecting"; then
    echo -e "${YELLOW}⚠ API requires authentication${NC}"
else
    echo "$response" | grep -q "success" && echo -e "${GREEN}✓ API returns success${NC}" || echo -e "${RED}✗ API error${NC}"
fi

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "Key Findings:"
echo "- Site is live and responding"
echo "- Authentication is required for most API endpoints (307 redirects)"
echo "- Public pages (/connect, /success) should be accessible"
echo "- OAuth flow needs manual testing through browser"
echo ""
echo "Manual Testing Required For:"
echo "1. Complete OAuth flow (QuickBooks connection)"
echo "2. Dashboard functionality (requires login)"
echo "3. Export functionality (PDF, PowerPoint, Google Slides)"
echo "4. File uploads (call transcripts)"
echo "5. UI/UX elements and interactions"
echo ""