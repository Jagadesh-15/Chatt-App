import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // root: '.', // keep as '.' if index.html is in the same folder
  // server: {
  //   port: 5174
  // },
  // build: {
  //   outDir: 'dist',
  //   emptyOutDir: true,
  // },
});
