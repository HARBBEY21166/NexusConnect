
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['@opentelemetry/sdk-node', 'require-in-the-middle', 'handlebars', 'dotprompt'],
    },
};

export default nextConfig;
