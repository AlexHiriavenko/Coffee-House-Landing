import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const base = '/Coffee-House-Landing/';
const componentsPath = resolve(import.meta.dirname, 'src/components');
const pages = {
  home: resolve(import.meta.dirname, 'index.html'),
  menu: resolve(import.meta.dirname, 'menu/index.html'),
};

export default defineConfig({
  base,
  appType: 'mpa',

  plugins: [
    handlebars({
      partialDirectory: componentsPath,

      context: {
        basePath: base,
      },
    }),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: pages,
    },
  },
});
