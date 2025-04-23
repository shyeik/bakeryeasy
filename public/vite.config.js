import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // Ensure correct base path for production
  plugins: [react()],
  optimizeDeps: {
    include: ["three"],
  },
  build: {
    outDir: "dist", // Ensures build output goes to 'dist'
    assetsDir: "assets", // Organizes assets
    minify: "terser", // Enables advanced minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        unused: true, // Enable tree shaking for unused code
        dead_code: true, // Remove unreachable code
      },
      output: {
        comments: false, // Remove comments for a cleaner build
      },
    },
    chunkSizeWarningLimit: 1000, // Increases chunk warning limit to 1000 kB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Separate vendor libraries for better caching
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // Optional: For global test setup
  },
});

