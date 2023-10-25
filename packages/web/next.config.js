/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nafo-ai/core'],
  experimental: {
    mdxRs: true,
    appDir: true,
    outputFileTracingExcludes: {
      '*': ['@swc/core', 'esbuild', 'uglify-js', 'watchpack', 'webassemblyjs', 'sharp'],
    },
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  redirects: async () => [
    {
      source: '/checkout/pending/:orderId',
      destination: '/checkout/pending/:orderId',
      has: [
        {
          type: 'header',
          key: 'Origin',
          value: 'https://pay.fondy.eu',
        },
      ],
      statusCode: 302,
    },
  ],

  images: {
    remotePatterns: [
      // Allow to access images from buckets
      {
        protocol: 'https',
        hostname: 'kyanka-nafo-legion-s3-creationsbucket070e58c8-1rs4dzvcsameu.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'dizzzmas-nafo-legion-s3-creationsbucket070e58c8-1cowcej9pzo0j.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'dev-nafo-legion-s3-creationsbucket070e58c8-pwxexcqh1mil.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'dev-nafo-legion-s3-creationsbucket070e58c8-pwxexcqh1mil.s3.eu-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-nafo-legion-s3-creationsbucket070e58c8-19iz4l5catzq5.s3.eu-central-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'prod-nafo-legion-s3-creationsbucket070e58c8-19iz4l5catzq5.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'nafoai.com',
      },
      {
        protocol: 'https',
        hostname: 'dev.nafoai.com',
      },
    ],
  },
};

/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withMDX = require('@next/mdx')();

module.exports = withBundleAnalyzer(withMDX(nextConfig));
