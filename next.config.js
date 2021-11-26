const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' *.vercel.app *.vercel.com *.chec.io *.stripe.com;
    child-src *.youtube.com *.google.com *.stripe.com;
    style-src 'self' 'unsafe-inline' *.googleapis.com;
    img-src 'self' *.chec.io blob: data:;
    media-src 'self' *.chec.io;
    font-src 'self' *.gstatic.com;
    connect-src *;
`;

const securityHeaders = [
    {
        key: 'Content-Security-Policy',
        value: ContentSecurityPolicy.replace(/\n/g, ''),
    },
    {
        key: 'Access-Control-Allow-Origin',
        value: '*.chec.io',
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
    },
];

module.exports = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        domains: ['cdn.chec.io'],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
};
