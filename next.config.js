/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
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
