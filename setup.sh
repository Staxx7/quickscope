#!/bin/bash

# setup.sh - Development environment setup script

echo "🚀 Setting up Ledgr development environment..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# QuickBooks OAuth
QBO_CLIENT_ID=your_client_id
QBO_CLIENT_SECRET=your_client_secret
QBO_REDIRECT_URI=https://your-tunnel.trycloudflare.com/api/auth/callback
QBO_ENVIRONMENT=sandbox

# Admin
ADMIN_PASSWORD=your_admin_password

# App
NEXT_PUBLIC_APP_URL=http://localhost:3005
EOF
    echo "⚠️  Please update .env.local with your actual values"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Clean build artifacts
echo "Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

# Fix common issues
echo "Fixing common configuration issues..."

# Ensure tailwind.config.js is correct
if grep -q "css.validate" tailwind.config.js 2>/dev/null; then
    echo "Fixing tailwind.config.js..."
    cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
EOF
fi

# Create necessary directories
mkdir -p app/api/qbo
mkdir -p app/api/transcripts
mkdir -p app/api/audit-deck
mkdir -p app/components
mkdir -p lib

echo "✅ Setup complete! Run 'npm run dev' to start the development server"
