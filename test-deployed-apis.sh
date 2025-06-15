#!/bin/bash

echo "🧪 Testing QuickScope Deployed APIs"
echo "===================================="

# Base URL
BASE_URL="https://www.quickscope.info"

# Test 1: Check if site is accessible
echo -e "\n1️⃣ Testing site accessibility..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$STATUS" = "200" ]; then
    echo "✅ Site is accessible (HTTP $STATUS)"
else
    echo "❌ Site returned HTTP $STATUS"
fi

# Test 2: Test market intelligence API
echo -e "\n2️⃣ Testing market intelligence API..."
curl -s "$BASE_URL/api/market-intelligence?industry=technology" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if 'data' in data:
        confidence = data['data']['dataSources']['confidence']
        sources = [k for k,v in data['data']['dataSources'].items() if v and k != 'confidence']
        print(f'✅ API working - Confidence: {confidence}')
        print(f'   Active sources: {sources}')
    else:
        print('❌ API error:', data.get('error', 'Unknown error'))
except Exception as e:
    print('❌ Failed to parse response:', str(e))
"

# Test 3: Test connected companies API (requires auth)
echo -e "\n3️⃣ Testing connected companies API..."
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/admin/connected-companies")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "$BODY" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if 'companies' in data:
        count = len(data['companies'])
        print(f'✅ Found {count} connected companies')
    else:
        print('❌ Unexpected response format')
except Exception as e:
    print('❌ Failed to parse response:', str(e))
"
else
    echo "❌ API returned HTTP $HTTP_CODE (may require authentication)"
fi

# Test 4: Check test APIs endpoint
echo -e "\n4️⃣ Testing debug APIs endpoint..."
curl -s "$BASE_URL/api/test-apis" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    print('API Key Status:')
    for api in ['bls', 'census']:
        if api in data.get('results', {}):
            has_key = '✅' if data['results'][api]['hasApiKey'] else '❌'
            print(f'   {api.upper()}: {has_key} (key length: {data[\"results\"][api][\"apiKeyLength\"]})')
except Exception as e:
    print('❌ Endpoint not available or error:', str(e))
"

echo -e "\n✨ Test complete!"