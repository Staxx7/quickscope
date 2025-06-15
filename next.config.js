/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://appcenter.intuit.com https://*.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.quickbooks.com https://sandbox-quickbooks.api.intuit.com https://oauth.platform.intuit.com https://*.supabase.co wss://*.supabase.co https://api.census.gov https://api.bls.gov https://api.stlouisfed.org https://www.alphavantage.co https://finnhub.io",
              "frame-src 'self' https://appcenter.intuit.com",
              "worker-src 'self' blob:",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
      {
        source: '/connect',
        headers: [
          {
            key: 'Link',
            value: '<https://appcenter.intuit.com>; rel=preconnect',
          },
          {
            key: 'Link',
            value: '<https://oauth.platform.intuit.com>; rel=dns-prefetch',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
