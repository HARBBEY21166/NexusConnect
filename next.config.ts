import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverComponentsExternalPackages: ['mongodb', 'bcryptjs'],
  webpack: (config) => {
    // The `handlebars` library, used by Genkit, has a dynamic require that causes a harmless webpack warning.
    // This rule suppresses that warning.
    config.ignoreWarnings = [
      (warning) =>
        warning.module?.resource?.includes('node_modules/handlebars/'),
    ];
    return config;
  },
};

export default nextConfig;
