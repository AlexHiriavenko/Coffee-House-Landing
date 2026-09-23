import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const base = '/Coffee-House-Landing/';
const partialsPath = resolve(import.meta.dirname, 'src/components');
const products = JSON.parse(
  readFileSync(resolve(import.meta.dirname, 'public/products.json'), 'utf8'),
);
const pages = {
  home: resolve(import.meta.dirname, 'index.html'),
  menu: resolve(import.meta.dirname, 'menu/index.html'),
};

export default defineConfig({
  base,
  appType: 'mpa',

  plugins: [
    handlebars({
      partialDirectory: partialsPath,

      context: {
        basePath: base,
        coffeeProducts: products.filter(({ category }) => category === 'coffee'),
      },
      helpers: {
        increment: (index) => index + 1,
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
