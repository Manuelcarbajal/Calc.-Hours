import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // generates 'manifest.webmanifest' file on build
      manifest: {
        // caches the assets/icons mentioned (assets/* includes all the assets present in your src/ directory)
        includeAssets: ["hour-svg.svg", "assets/*"],
        name: "Calc.Hours CH",
        short_name: "CH",
        start_url: "/",
        background_color: "#808080",
        theme_color: "#000000",
        icons: [
          {
            src: "hour-svg.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "hour-svg.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
      },
    }),
  ],
});
