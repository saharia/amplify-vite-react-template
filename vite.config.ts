import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      parseNative: false
    }),
    svgrPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    open: false,
    strictPort: false,
    port: 5173,
  },
  define: {
    'import.meta.env.VITE_PORT': 5173,
    global: 'window'
  },
  resolve: {
    alias: {
      '@': '/src',
      '@fuse': '/src/@fuse',
      '@shared': '/shared',
      '@i18n': '/src/@i18n',
      '@lodash': '/src/@lodash',
      'app/store': '/src/app/store',
      'app/shared-components': '/src/app/shared-components',
      'app/configs': '/src/app/configs',
      'app/theme-layouts': '/src/app/theme-layouts',
      'app/AppContext': '/src/app/AppContex'
    }
  },
})
