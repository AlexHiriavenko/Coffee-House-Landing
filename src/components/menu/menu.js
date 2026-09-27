import { createCatalogService } from './catalog/catalogService.js';
import { createModalService } from './modal/modalService.js';

const catalogElement = document.querySelector('.menu');
const modalElement = document.getElementById('modal-container');

if (catalogElement && modalElement) {
  const modalService = createModalService(modalElement);
  const catalogService = createCatalogService(catalogElement, {
    onCardSelect: modalService.open,
  });

  modalService.init();
  catalogService.init();
}
