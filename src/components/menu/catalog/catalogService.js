import { fetchProducts } from './productsRepository.js';
import { getProductId, getCardImageUrl, createProductCardMarkup } from './catalogHelpers.js';

const INITIAL_CARDS_COUNT = 4;
// Keep in sync with the `max-width: 992px` breakpoint in catalog.scss / product-list.scss
const COLLAPSIBLE_CARDS_QUERY = '(max-width: 992px)';

export function createCatalogService(catalogElement, { onCardSelect } = {}) {
  const cardsList = catalogElement.querySelector('.cards-list');
  const categoryButtons = [...catalogElement.querySelectorAll('.menu-item_btn')];
  const loadMoreButton = catalogElement.querySelector('.reload-btn');
  const collapsibleCardsQuery = window.matchMedia(COLLAPSIBLE_CARDS_QUERY);

  let products = [];
  let activeCategoryProductsCount = 0;
  let activeCategoryProductsById = new Map();

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

    activeCategoryProductsById = new Map(
      categoryProducts.map((product, index) => [
        getProductId(product, index),
        { product, imageUrl: getCardImageUrl(product, index) },
      ]),
    );

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

  function handleCardsListClick(event) {
    const card = event.target.closest('.card');

    if (!card) return;

    const entry = activeCategoryProductsById.get(card.dataset.productId);

    onCardSelect(entry.product, entry.imageUrl);
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
    cardsList.addEventListener('click', handleCardsListClick);
  }

  return { init };
}
