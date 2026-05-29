import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ClassyShop",
        short_name: "ClassyShop",
        description: "Premium Gadgets and Apparel Shop",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "main-logo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "main-logo.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "main-logo.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
