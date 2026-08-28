import { sites } from '@openai/sites-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), ...(isSsrBuild ? [] : [sites()])],
  server: {
    watch: process.env.CODEX_SANDBOX === 'seatbelt' ? { usePolling: true } : undefined,
  },
}));
