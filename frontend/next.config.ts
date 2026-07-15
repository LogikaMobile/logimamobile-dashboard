import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  assetPrefix: '/lm-assets', // ATENCIÓN: Descomentado para producción. Comentar en local si rompe estilos.
};

export default nextConfig;

