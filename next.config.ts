// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   cacheComponents: false,
//   partialPrefetching: false,
//   reactCompiler: true,
//   turbopack: {
//     rules: {
//       "*.css": {
//         loaders: ["@tailwindcss/turbopack"],
//         as: "*.css",
//       },
//     },
//   },
// };

// export default nextConfig;




import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // ✅ নতুন যোগ করা — বাহিরের ছবি লোড করার জন্য
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
      {
        protocol: "https",
        hostname: "murdermayhemandlongdogs.com",
      },
    ],
  },
};

export default nextConfig;
