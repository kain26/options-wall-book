import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Keep the Node prerender bundle isolated from the Cloudflare/Sites client plugin.
// Cloudflare's build environment activates that plugin differently than local Vite,
// which otherwise changes the entry filename and breaks the prerender import.
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: '.seo-ssr',
    emptyOutDir: true,
  },
});
