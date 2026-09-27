/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubActions ? '/we-milan' : '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
