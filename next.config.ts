import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sprites are served by PokéAPI's sprite repository (CLAUDE.md: no other artwork).
    remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/PokeAPI/sprites/**" }],
  },
};

export default nextConfig;
