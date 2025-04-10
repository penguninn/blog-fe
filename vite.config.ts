import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react(), 
      tailwindcss(),
      createHtmlPlugin({
        minify: isProduction
      })
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
    // build: {
    //   sourcemap: !isProduction,
    //   minify: isProduction ? 'esbuild' : false,
    //   chunkSizeWarningLimit: 1000,
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         'vendor-react': ['react', 'react-dom', 'react-router-dom'],
    //         'vendor-ui': ['@radix-ui/react-alert-dialog', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 
    //                       '@radix-ui/react-label', '@radix-ui/react-navigation-menu', '@radix-ui/react-popover', 
    //                       '@radix-ui/react-select', '@radix-ui/react-separator', '@radix-ui/react-slot', 
    //                       '@radix-ui/react-tooltip'],
    //         'vendor-tiptap': ['@tiptap/extension-blockquote', '@tiptap/extension-bullet-list', '@tiptap/extension-code-block',
    //                          '@tiptap/extension-heading', '@tiptap/extension-image', '@tiptap/extension-link',
    //                          '@tiptap/extension-list-item', '@tiptap/extension-ordered-list', '@tiptap/extension-paragraph',
    //                          '@tiptap/extension-placeholder', '@tiptap/extension-table', '@tiptap/extension-table-cell',
    //                          '@tiptap/extension-table-header', '@tiptap/extension-table-row', '@tiptap/extension-text',
    //                          '@tiptap/extension-text-align', '@tiptap/extension-underline', '@tiptap/pm',
    //                          '@tiptap/react', '@tiptap/starter-kit']
    //       }
    //     }
    //   }
    // }
  };
});
