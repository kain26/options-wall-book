import { sites } from '@openai/sites-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), sites()],
  server: {
    watch: process.env.CODEX_SANDBOX === 'seatbelt' ? { usePolling: true } : undefined,
  },
});
