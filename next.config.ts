import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Prisma để Next.js có thể bundle nó
  transpilePackages: ["@prisma/client"],
  
  // Cấu hình Turbopack (Next.js 16 sử dụng Turbopack mặc định)
  turbopack: {
    // Turbopack sẽ tự động handle Prisma client
  },
};

export default nextConfig;
