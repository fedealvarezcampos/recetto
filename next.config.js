const ContentSecurityPolicy = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.in *.vercel.app *.vercel.com;
    child-src *.google.com *.supabase.in;
    style-src 'self' 'unsafe-inline' *.googleapis.com;
    img-src 'self' *.supabase.in blob: data:;
    media-src 'self';
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
    images: {
        domains: ['kfbmibfvknusdwjqdxeh.supabase.in'],
        formats: ['image/avif', 'image/webp'],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                // headers: securityHeaders,
            },
        ];
    },
};
