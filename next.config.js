/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["172.20.10.2"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
