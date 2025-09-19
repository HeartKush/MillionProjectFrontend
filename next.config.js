/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5120",
  },
  images: {
    domains: ["localhost", "via.placeholder.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5120"
        }/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
