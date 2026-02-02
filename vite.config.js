import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    // Optimize chunk size and loading speed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) {
              return "firebase";
            }
            if (id.includes("react-icons") || id.includes("react-toastify")) {
              return "ui-libs";
            }
            if (id.includes("mapbox-gl")) {
              return "mapbox";
            }
            if (id.includes("@mercadopago")) {
              return "mercadopago";
            }
            return "vendor";
          }
          if (
            id.includes("src/pages/Admin") &&
            (id.includes("ProductManagement") ||
              id.includes("UserManagement") ||
              id.includes("OrderManagement"))
          ) {
            return "admin";
          }
        },
      },
    },
    // Increase warning limit for larger chunks
    chunkSizeWarningLimit: 800,
    // Minify agresivo
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimizar resolución de módulos
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
