import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'hybrid', // Set output to 'hybrid' to enable both static and server modes
  integrations: [react()],
  vite: {
    ssr: {
      noExternal: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
    },
  },
});