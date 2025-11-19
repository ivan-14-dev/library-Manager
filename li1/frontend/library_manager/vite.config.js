import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'styled-components': 'styled-components',
      'react-router-dom': 'react-router-dom',
    },
  },
  optimizeDeps: {
    include: ['styled-components', 'react-router-dom'],
  },
});
