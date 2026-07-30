import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const r = (p) => resolve(__dirname, p);

// This project builds a static multi-page React site. Source HTML entry
// points live at their final route paths (e.g. /about/index.html) so
// Vite's default output mapping already matches the GitHub Pages URL
// structure. `static/` holds true passthrough files (images, CNAME,
// Jekyll config, well-known) copied verbatim into the build. Everything
// gets emitted into `public/`, which is what GitHub Pages serves.
export default defineConfig({
  plugins: [react()],
  publicDir: r('static'),
  build: {
    outDir: r('public'),
    emptyOutDir: true,
    assetsDir: 'app-assets',
    rollupOptions: {
      input: {
        main: r('index.html'),
        about: r('about/index.html'),
        docsIndex: r('docs/index.html'),
        docsCommGl: r('docs/comm_gl.html'),
        docsPrivpol: r('docs/privpol.html'),
        docsTos: r('docs/tos.html'),
        download: r('download/index.html'),
        deleteAccount: r('delete_account/index.html'),
        resetPassword: r('reset_password/index.html'),
        verifyEmail: r('verify_email/index.html'),
      },
    },
  },
});
