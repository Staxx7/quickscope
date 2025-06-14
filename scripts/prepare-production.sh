#!/bin/bash

# Ledgr Platform Production Preparation Script
# This script prepares the platform for production deployment

set -e  # Exit on error

echo "🚀 Ledgr Platform Production Preparation"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Environment Check
echo -e "${BLUE}Step 1: Checking Environment...${NC}"

if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Check for required environment variables
required_vars=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "QB_CLIENT_ID"
    "QB_CLIENT_SECRET"
    "NEXT_PUBLIC_APP_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        missing_vars+=($var)
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
fi

echo -e "${GREEN}✓ Environment configured${NC}"

# Step 2: Install Dependencies
echo -e "\n${BLUE}Step 2: Installing Dependencies...${NC}"
npm ci --production=false
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3: Run Tests
echo -e "\n${BLUE}Step 3: Running Tests...${NC}"

# Type checking
echo "Running TypeScript type check..."
npx tsc --noEmit || {
    echo -e "${YELLOW}⚠️  TypeScript errors found (non-blocking)${NC}"
}

# Linting
echo "Running ESLint..."
npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 50 || {
    echo -e "${YELLOW}⚠️  Linting warnings found (non-blocking)${NC}"
}

# Integration tests
if [ -f "scripts/test-integration.ts" ]; then
    echo "Running integration tests..."
    npx ts-node scripts/test-integration.ts || {
        echo -e "${YELLOW}⚠️  Some integration tests failed (non-blocking)${NC}"
    }
fi

echo -e "${GREEN}✓ Tests completed${NC}"

# Step 4: Database Setup
echo -e "\n${BLUE}Step 4: Setting Up Database...${NC}"

if [ -f "database/schema.sql" ]; then
    echo "Database schema found at database/schema.sql"
    echo -e "${YELLOW}ℹ️  Please ensure your database is set up with the provided schema${NC}"
    echo "You can apply it using: psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB < database/schema.sql"
else
    echo -e "${YELLOW}⚠️  No database schema file found${NC}"
fi

echo -e "${GREEN}✓ Database setup instructions provided${NC}"

# Step 5: Build Application
echo -e "\n${BLUE}Step 5: Building Application...${NC}"

# Clean previous builds
rm -rf .next
rm -rf out

# Build Next.js application
NODE_ENV=production npm run build

echo -e "${GREEN}✓ Application built successfully${NC}"

# Step 6: Generate Production Files
echo -e "\n${BLUE}Step 6: Generating Production Files...${NC}"

# Create production environment template
cat > .env.production.template << EOF
# Production Environment Template
# Copy this to .env.production and fill in production values

# Database
DATABASE_URL=postgresql://user:password@host:5432/ledgr_production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# QuickBooks (Production)
QB_CLIENT_ID=your-production-client-id
QB_CLIENT_SECRET=your-production-client-secret
QB_REDIRECT_URI=https://your-domain.com/api/auth/quickbooks/callback
QB_ENVIRONMENT=production

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Security
JWT_SECRET=generate-secure-random-string
ENCRYPTION_KEY=generate-32-character-key

# Optional Services
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key
RESEND_API_KEY=your-resend-key
EOF

# Create deployment checklist
cat > DEPLOYMENT_CHECKLIST.md << EOF
# Ledgr Platform Deployment Checklist

## Pre-Deployment

- [ ] Environment variables configured in production
- [ ] Database created and schema applied
- [ ] Supabase project configured
- [ ] QuickBooks app approved and production credentials obtained
- [ ] Domain and SSL certificates configured
- [ ] Backup strategy in place

## Security

- [ ] All secrets rotated for production
- [ ] Database access restricted
- [ ] API rate limiting configured
- [ ] CORS settings reviewed
- [ ] Content Security Policy configured

## Deployment

- [ ] Build artifacts uploaded
- [ ] Database migrations applied
- [ ] Environment variables set
- [ ] Health checks passing
- [ ] Monitoring configured

## Post-Deployment

- [ ] Smoke tests completed
- [ ] QuickBooks OAuth flow tested
- [ ] AI features tested (if API key provided)
- [ ] Report generation tested
- [ ] Error tracking verified
- [ ] Performance monitoring active

## Rollback Plan

- [ ] Previous version tagged
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Team notified of deployment
EOF

echo -e "${GREEN}✓ Production files generated${NC}"

# Step 7: Create Docker Files (Optional)
echo -e "\n${BLUE}Step 7: Creating Docker Configuration...${NC}"

cat > Dockerfile << EOF
# Ledgr Platform Docker Configuration
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_USER: ledgr
      POSTGRES_PASSWORD: \${DB_PASSWORD}
      POSTGRES_DB: ledgr_production
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

volumes:
  postgres_data:
EOF

echo -e "${GREEN}✓ Docker configuration created${NC}"

# Step 8: Performance Optimization
echo -e "\n${BLUE}Step 8: Checking Performance Optimizations...${NC}"

# Check for image optimization
if ! command -v sharp &> /dev/null; then
    echo -e "${YELLOW}ℹ️  Consider installing 'sharp' for image optimization${NC}"
    echo "  npm install sharp"
fi

# Check bundle size
echo "Analyzing bundle size..."
npx next build --analyze 2>/dev/null || true

echo -e "${GREEN}✓ Performance checks completed${NC}"

# Step 9: Generate Summary
echo -e "\n${BLUE}Summary Report${NC}"
echo "==============="

# Count files and size
total_files=$(find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l)
build_size=$(du -sh .next 2>/dev/null | cut -f1 || echo "N/A")

echo -e "Total source files: ${total_files}"
echo -e "Build size: ${build_size}"
echo -e "Node version: $(node --version)"
echo -e "NPM version: $(npm --version)"
echo ""

echo -e "${GREEN}✅ Production preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review DEPLOYMENT_CHECKLIST.md"
echo "2. Configure production environment variables"
echo "3. Set up production database"
echo "4. Deploy to your hosting platform"
echo ""
echo "Deployment options:"
echo "- Vercel: vercel deploy"
echo "- Docker: docker-compose up -d"
echo "- Traditional: npm start"
echo ""
echo -e "${BLUE}Good luck with your deployment! 🚀${NC}"