#!/bin/bash

# Batch Environment Variable Renaming Script
# This script standardizes all QuickBooks environment variables to use QB_ prefix

echo "🔧 Starting environment variable standardization..."

# Create backup
echo "📁 Creating backup..."
cp -r app app.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# Replace QUICKBOOKS_ with QB_ in environment variable references
echo "🔄 Replacing QUICKBOOKS_ prefixes with QB_..."
find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e 's/process\.env\.QUICKBOOKS_CLIENT_ID/process.env.QB_CLIENT_ID/g' \
  -e 's/process\.env\.QUICKBOOKS_CLIENT_SECRET/process.env.QB_CLIENT_SECRET/g' \
  -e 's/process\.env\.QUICKBOOKS_REDIRECT_URI/process.env.QB_REDIRECT_URI/g' \
  -e 's/process\.env\.QUICKBOOKS_SCOPE/process.env.QB_SCOPE/g' \
  -e 's/process\.env\.QUICKBOOKS_BASE_URL/process.env.QB_BASE_URL/g' \
  -e 's/process\.env\.QUICKBOOKS_SANDBOX_BASE_URL/process.env.QB_BASE_URL/g' \
  -e 's/process\.env\.QUICKBOOKS_DISCOVERY_DOCUMENT/process.env.QB_DISCOVERY_DOCUMENT_URL/g' \
  {} +

# Replace QBO_ with QB_ in environment variable references
echo "🔄 Replacing QBO_ prefixes with QB_..."
find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e 's/process\.env\.QBO_/process.env.QB_/g' \
  {} +

# Update any string references in environment checks
echo "🔄 Updating environment variable name strings..."
find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i \
  -e "s/'Missing QUICKBOOKS_CLIENT_ID'/'Missing QB_CLIENT_ID'/g" \
  -e "s/'Missing QUICKBOOKS_CLIENT_SECRET'/'Missing QB_CLIENT_SECRET'/g" \
  -e "s/'Missing QUICKBOOKS_REDIRECT_URI'/'Missing QB_REDIRECT_URI'/g" \
  -e "s/\"Missing QUICKBOOKS_/\"Missing QB_/g" \
  {} +

# Count changes
echo "📊 Counting changes..."
CHANGES=$(find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec grep -l "QB_" {} + | wc -l)

echo "✅ Environment variable standardization complete!"
echo "📝 Modified $CHANGES files to use QB_ prefix"
echo ""
echo "⚠️  Remember to update your .env file with the new variable names!"
echo "📄 Use .env.example as a template"