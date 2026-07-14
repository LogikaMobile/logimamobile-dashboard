import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // assetPrefix: '/lm-assets', // Comentado para desarrollo local (rompe los estilos)
};

export default nextConfig;

