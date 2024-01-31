import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin(), nodePolyfills()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
  base: '/',
});
