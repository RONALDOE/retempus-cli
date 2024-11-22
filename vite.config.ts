import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@src": "/src",
        "@assets": "/src/assets",
        "@components": "/src/components",
        "@utils": "/src/utils",
        "@pages": "/src/pages",
        "@contexts": "/src/contexts",
      },
    },
  };
});
