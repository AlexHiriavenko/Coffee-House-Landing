import { fetchProducts } from './productsRepository.js';
import { createProductCardMarkup } from './catalogHelpers.js';

export function createCatalogService(catalogElement) {
  const cardsList = catalogElement.querySelector('.cards-list');
  const categoryButtons = [...catalogElement.querySelectorAll('.menu-item_btn')];

  let products = [];

  function getActiveCategory() {
    return categoryButtons.find((button) => button.classList.contains('selected')).dataset
      .category;
  }

  function renderCategory(category) {
    const categoryProducts = products.filter((product) => product.category === category);

    cardsList.innerHTML = categoryProducts
      .map((product, index) => createProductCardMarkup(product, index))
      .join('');
  }

  async function init() {
    products = await fetchProducts();
    renderCategory(getActiveCategory());
  }

  return { init };
}
