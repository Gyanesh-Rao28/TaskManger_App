module.exports = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://taskbackend-lac.vercel.app/:path*',
            },
        ]
    },
};