import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const defaultImageRemotePatterns = [
  {
    protocol: 'https',
    hostname: 'cdn.heydream.im',
    port: '',
    pathname: '/**',
  },
];

function parseImageRemotePatterns(value) {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [protocolPart, hostnamePart] = item.includes('://') ? item.split('://') : ['https', item];
      const protocol = protocolPart === 'http' ? 'http' : 'https';

      return {
        protocol,
        hostname: hostnamePart,
        port: '',
        pathname: '/**',
      };
    });
}

const imageRemotePatterns = parseImageRemotePatterns(process.env.IMAGE_REMOTE_PATTERNS);
const allowLocalImageOptimization = process.env.ALLOW_LOCAL_IMAGE_OPTIMIZATION === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  htmlLimitedBots: '.*',
  typescript: {
    ignoreBuildErrors: true,
  },
  redirects: async () => [],
  env: {
    NEXT_BASE_API: process.env.NEXT_BASE_API,
    SITE_ID: process.env.SITE_ID,
  },
  trailingSlash: true,
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    unoptimized: false,
    // Next 16 blocks image optimization for private IPs by default; enable via environment variable only if explicitly needed.
    dangerouslyAllowLocalIP: allowLocalImageOptimization,
    remotePatterns: imageRemotePatterns.length > 0 ? imageRemotePatterns : defaultImageRemotePatterns,
  },
  productionBrowserSourceMaps: false,
};

export default withNextIntl(nextConfig);
