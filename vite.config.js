import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';

const componentsPath = resolve(import.meta.dirname, 'src/components');

export default defineConfig({
  base: '/RSSchool/portfolio-example/',

  plugins: [
    handlebars({
      partialDirectory: componentsPath,
    }),
  ],
});