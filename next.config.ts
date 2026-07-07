import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/OFFERTE-WIJS" : "",
  },
  ...(isGithubPages && {
    basePath: "/OFFERTE-WIJS",
    assetPrefix: "/OFFERTE-WIJS/",
  }),
};

export default nextConfig;
