import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/simulate": ["./bin/**/*", "./src/lib/**/*"],
  },
};

export default nextConfig;
