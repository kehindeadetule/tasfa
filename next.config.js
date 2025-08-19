/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "172.20.10.2", // Local development
      "tasfa-test.s3.amazonaws.com", // AWS S3 bucket for images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tasfa-test.s3.amazonaws.com",
        port: "",
        pathname: "/voting-uploads/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        port: "",
        pathname: "/voting-uploads/**",
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Redirect HTTP to HTTPS in production
  async redirects() {
    return process.env.NODE_ENV === "production"
      ? [
          {
            source: "/:path*",
            has: [
              {
                type: "header",
                key: "x-forwarded-proto",
                value: "http",
              },
            ],
            destination: "https://www.tasfa.com.ng/:path*",
            permanent: true,
          },
        ]
      : [];
  },
};

module.exports = nextConfig;
