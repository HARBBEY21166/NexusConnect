/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.pinimg.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    serverComponentsExternalPackages: [
        '@google-cloud/functions-framework',
        'firebase-admin',
        'google-auth-library',
        'gaxios',
        'handlebars',
        'require-in-the-middle'
    ],
};

export default nextConfig;
