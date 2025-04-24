import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: '.', // current directory
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});