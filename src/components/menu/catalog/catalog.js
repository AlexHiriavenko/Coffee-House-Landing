import { createCatalogService } from './catalogService.js';

const catalogElement = document.querySelector('.menu');

if (catalogElement) {
  createCatalogService(catalogElement).init();
}
