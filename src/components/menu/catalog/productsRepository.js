const PRODUCTS_URL = `${import.meta.env.BASE_URL}products.json`;

export async function fetchProducts() {
  const response = await fetch(PRODUCTS_URL);

  return response.json();
}
