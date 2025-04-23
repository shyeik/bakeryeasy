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
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js", // Optional: For global test setup
  },
});
