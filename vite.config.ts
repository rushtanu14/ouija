import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const clientHost = process.env.HOST ?? "127.0.0.1";
const clientPort = Number(process.env.OUIJA_CLIENT_PORT ?? process.env.PORT ?? 5188);
const apiHost = process.env.OUIJA_API_HOST ?? "127.0.0.1";
const apiPort = Number(process.env.OUIJA_API_PORT ?? 8787);

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
    host: clientHost,
    port: clientPort,
    strictPort: true,
    proxy: {
      "/api": `http://${apiHost}:${apiPort}`
    }
  }
});
