export function getProductId(product, indexInCategory) {
  return `${product.category}-${indexInCategory + 1}`;
}

export function getCardImageUrl(product, indexInCategory) {
  return `${import.meta.env.BASE_URL}cards-images/${product.category}/${getProductId(product, indexInCategory)}.png`;
}

export function createProductCardMarkup(product, indexInCategory) {
  return `
    <li class="card" data-product-id="${getProductId(product, indexInCategory)}">
      <picture class="card-photo">
        <img src="${getCardImageUrl(product, indexInCategory)}" alt="${product.name}" />
      </picture>
      <div class="card-text-content">
        <h2 class="card-title">${product.name}</h2>
        <p class="card-description">${product.description}</p>
        <span class="card-price">$${product.price}</span>
      </div>
    </li>
  `;
}
