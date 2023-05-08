import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      open: true,
      port: 3000,
    },
    define: {
      "process.env": {},
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
  };
});
