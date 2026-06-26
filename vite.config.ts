import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          vendor: ["react", "react-dom", "lucide-react"]
        }
      }
    }
  },
  server: {
    host: "127.0.0.1",
    port: 5188,
    proxy: {
      "/api": "http://127.0.0.1:8787"
    }
  }
});
