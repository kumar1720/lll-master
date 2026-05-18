import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  preview: {
    allowedHosts: true
  },
  server: {
    proxy: {
      '/api/listings': {
        target: 'https://laganlakshmiinfra.com',
        changeOrigin: true,
        secure: true,
        timeout: 10000, // 10 second timeout
        rewrite: (path) => path.replace(/^\/api\/listings/, '/api/listings'),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxy response status:', proxyRes.statusCode);
          });
        }
      },
      '/api/properties': {
        target: 'https://laganlakshmiinfra.com',
        changeOrigin: true,
        secure: true,
        timeout: 10000,
        rewrite: (path) => path.replace(/^\/api\/properties/, '/api/properties'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Property proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying property request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Property proxy response status:', proxyRes.statusCode);
          });
        }
      },
      '/api/profile': {
        target: 'https://laganlakshmiinfra.com',
        changeOrigin: true,
        secure: true,
        timeout: 10000,
        rewrite: (path) => path.replace(/^\/api\/profile/, '/api/profile'),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('Profile proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying profile request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('Profile proxy response status:', proxyRes.statusCode);
          });
        }
      },
      '/api/chat': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api/documents': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://laganlakshmiinfra.com',
        changeOrigin: true,
        secure: true,
        timeout: 10000,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('API proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq) => {
            console.log('Proxying API request to:', proxyReq.getHeader('host') + proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes) => {
            console.log('API proxy response status:', proxyRes.statusCode);
          });
        }
      }
    }
  }
})
