import { fetchProducts } from './productsRepository.js';
import { createProductCardMarkup } from './catalogHelpers.js';

const INITIAL_CARDS_COUNT = 4;
// Keep in sync with the `max-width: 992px` breakpoint in catalog.scss / product-list.scss
const COLLAPSIBLE_CARDS_QUERY = '(max-width: 992px)';

export function createCatalogService(catalogElement) {
  const cardsList = catalogElement.querySelector('.cards-list');
  const categoryButtons = [...catalogElement.querySelectorAll('.menu-item_btn')];
  const loadMoreButton = catalogElement.querySelector('.reload-btn');
  const collapsibleCardsQuery = window.matchMedia(COLLAPSIBLE_CARDS_QUERY);

  let products = [];
  let activeCategoryProductsCount = 0;

  function getActiveCategory() {
    return categoryButtons.find((button) => button.classList.contains('selected')).dataset
      .category;
  }

  function setActiveCategoryButton(activeButton) {
    categoryButtons.forEach((button) => {
      const isActive = button === activeButton;

      button.classList.toggle('selected', isActive);
      button.disabled = isActive;
    });
  }

  function collapseCardsList() {
    cardsList.classList.remove('full');
    loadMoreButton.classList.toggle(
      'is-hidden',
      activeCategoryProductsCount <= INITIAL_CARDS_COUNT,
    );
  }

  function renderCategory(category) {
    const categoryProducts = products.filter((product) => product.category === category);

    cardsList.innerHTML = categoryProducts
      .map((product, index) => createProductCardMarkup(product, index))
      .join('');

    activeCategoryProductsCount = categoryProducts.length;
    collapseCardsList();
  }

  function handleCategoryButtonClick(event) {
    const button = event.target.closest('.menu-item_btn');

    if (!button || button.classList.contains('selected')) return;

    setActiveCategoryButton(button);
    renderCategory(button.dataset.category);
  }

  function loadMoreCards() {
    cardsList.classList.add('full');
    loadMoreButton.classList.add('is-hidden');
  }

  function handleCollapsibleCardsQueryChange() {
    collapseCardsList();
  }

  async function init() {
    products = await fetchProducts();
    renderCategory(getActiveCategory());

    categoryButtons.forEach((button) => {
      button.addEventListener('click', handleCategoryButtonClick);
    });
    loadMoreButton.addEventListener('click', loadMoreCards);
    collapsibleCardsQuery.addEventListener('change', handleCollapsibleCardsQueryChange);
  }

  return { init };
}
