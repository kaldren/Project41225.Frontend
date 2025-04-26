import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const srcFolder = resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(srcFolder),
    },
  },
});
