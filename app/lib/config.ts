// Centralized Configuration Management
// This file provides a single source of truth for all environment variables

export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
    supabase: {
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || '',
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    }
  },

  // QuickBooks Configuration (Standardized QB_ prefix)
  quickbooks: {
    clientId: process.env.QUICKBOOKS_CLIENT_ID || '',
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET || '',
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/quickbooks/callback`,
    environment: process.env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    discoveryDocumentUrl: process.env.QUICKBOOKS_DISCOVERY_DOCUMENT_URL || 'https://developer.intuit.com/.well-known/openid_configuration',
    tokenUrl: process.env.QUICKBOOKS_TOKEN_URL || 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
    authorizationUrl: process.env.QUICKBOOKS_AUTHORIZATION_URL || 'https://appcenter.intuit.com/connect/oauth2',
    scope: process.env.QUICKBOOKS_SCOPE || 'com.intuit.quickbooks.accounting',
    webhookVerifierToken: process.env.QUICKBOOKS_WEBHOOK_VERIFIER_TOKEN || '',
    baseUrl: process.env.QUICKBOOKS_ENVIRONMENT === 'production' 
      ? 'https://quickbooks.api.intuit.com'
      : 'https://sandbox-quickbooks.api.intuit.com',
  },

  // OpenAI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  // Stripe Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Email Configuration (Resend)
  email: {
    resendApiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'notifications@ledgr.com',
  },

  // Application Configuration
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    jwtSecret: process.env.JWT_SECRET || '',
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    environment: process.env.NODE_ENV || 'development',
  },

  // External APIs
  externalApis: {
    census: {
      apiKey: process.env.CENSUS_API_KEY || '',
      baseUrl: 'https://api.census.gov',
    },
    bls: {
      apiKey: process.env.BLS_API_KEY || '',
      baseUrl: 'https://api.bls.gov',
    },
  },

  // Feature Flags
  features: {
    ai: process.env.ENABLE_AI_FEATURES === 'true',
    externalData: process.env.ENABLE_EXTERNAL_DATA === 'true',
    callAnalysis: process.env.ENABLE_CALL_ANALYSIS === 'true',
  },
};

// Type definitions for better TypeScript support
export type Config = typeof config;

// Validation function to check required configuration
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const missingVars: string[] = [];

  // Check critical environment variables
  if (!config.database.supabase.url) missingVars.push('SUPABASE_URL');
  if (!config.database.supabase.anonKey) missingVars.push('SUPABASE_ANON_KEY');
  if (!config.quickbooks.clientId) missingVars.push('QUICKBOOKS_CLIENT_ID');
  if (!config.quickbooks.clientSecret) missingVars.push('QUICKBOOKS_CLIENT_SECRET');
  if (!config.openai.apiKey && config.features.ai) missingVars.push('OPENAI_API_KEY');
  if (!config.app.jwtSecret) missingVars.push('JWT_SECRET');

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
}

// Helper function to get QuickBooks API URL
export function getQuickBooksApiUrl(realmId: string, endpoint: string): string {
  return `${config.quickbooks.baseUrl}/v3/company/${realmId}/${endpoint}`;
}

// Export individual configs for backward compatibility
export const quickbooksConfig = config.quickbooks;
export const supabaseConfig = config.database.supabase;
export const openaiConfig = config.openai;
export const appConfig = config.app;