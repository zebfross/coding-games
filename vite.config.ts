import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/coding-games/",
  server: { host: true },
  plugins: [
    // Self-destroying SW: actively unregisters and clears caches for anyone who
    // installed a previous version, then removes itself. Keeps the manifest so
    // "Add to Home Screen" still works on mobile, but there's no offline cache
    // and every load fetches the latest assets.
    VitePWA({
      selfDestroying: true,
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Coding Games",
        short_name: "CodingGames",
        description: "A toddler-friendly coding adventure",
        theme_color: "#1c8a3a",
        background_color: "#a8e6a3",
        display: "fullscreen",
        orientation: "landscape",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
});
