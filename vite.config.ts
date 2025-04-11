import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: true,
      allowedHosts: ['pengunin-blog.onrender.com', 'blog.penguninn.com'],
      cors: true,
    },
    preview: {
      host: true,
      allowedHosts: ['pengunin-blog.onrender.com', 'blog.penguninn.com'],
      cors: true,
    },
  };
});
