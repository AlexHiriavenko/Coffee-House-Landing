const SIZE_KEYS = ['s', 'm', 'l'];

export function createModalService(modalContainer) {
  const modalContent = modalContainer.querySelector('#modal-content');
  const closeButton = modalContainer.querySelector('.btn-close-modal');
  const photo = modalContainer.querySelector('.modal-card-photo');
  const nameEl = modalContainer.querySelector('.modal-drink-name');
  const aboutEl = modalContainer.querySelector('.modal-drink-about');
  const priceEl = modalContainer.querySelector('.drink-total-price');
  const sizeButtons = [...modalContainer.querySelectorAll('.modal-drink-params.size .modal-drink-params-btn')];
  const additiveButtons = [
    ...modalContainer.querySelectorAll('.modal-drink-params.additives .modal-drink-params-btn'),
  ];

  let currentProduct = null;
  let selectedSizeIndex = 0;
  const selectedAdditiveIndexes = new Set();

  function fillProductSizeButtons(product) {
    sizeButtons.forEach((button, index) => {
      const sizeKey = SIZE_KEYS[index];
      const sizeInfo = product.sizes[sizeKey];

      button.querySelector('.drink-size').textContent = sizeInfo.size;
    });
  }

  function fillProductAdditiveButtons(product) {
    additiveButtons.forEach((button, index) => {
      const additive = product.additives[index];

      button.querySelector('.additives-name').textContent = additive.name;
    });
  }

  function updateTotalPrice() {
    const sizePrice = Number(currentProduct.sizes[SIZE_KEYS[selectedSizeIndex]]['add-price']);
    const additivesPrice = [...selectedAdditiveIndexes].reduce(
      (sum, index) => sum + Number(currentProduct.additives[index]['add-price']),
      0,
    );

    priceEl.textContent = (Number(currentProduct.price) + sizePrice + additivesPrice).toFixed(2);
  }

  function resetParams() {
    selectedSizeIndex = 0;
    selectedAdditiveIndexes.clear();

    sizeButtons.forEach((button, index) => {
      button.classList.toggle('active', index === selectedSizeIndex);
      button.disabled = index === selectedSizeIndex;
    });
    additiveButtons.forEach((button) => button.classList.remove('active'));
  }

  function fillContent(product, imageUrl) {
    currentProduct = product;

    photo.src = imageUrl;
    photo.alt = product.name;
    nameEl.textContent = product.name;
    aboutEl.textContent = product.description;

    fillProductSizeButtons(product);
    fillProductAdditiveButtons(product);
    resetParams();
    updateTotalPrice();
  }

  function selectSize(index) {
    selectedSizeIndex = index;

    sizeButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('active', buttonIndex === index);
      button.disabled = buttonIndex === index;
    });
    updateTotalPrice();
  }

  function toggleAdditive(index) {
    if (selectedAdditiveIndexes.has(index)) {
      selectedAdditiveIndexes.delete(index);
    } else {
      selectedAdditiveIndexes.add(index);
    }

    additiveButtons[index].classList.toggle('active', selectedAdditiveIndexes.has(index));
    updateTotalPrice();
  }

  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') close();
  }

  function open(product, imageUrl) {
    fillContent(product, imageUrl);

    modalContainer.classList.add('active');
    modalContent.classList.add('active');
    lockScroll();
    document.addEventListener('keydown', handleKeydown);
  }

  function close() {
    modalContainer.classList.remove('active');
    modalContent.classList.remove('active');
    unlockScroll();
    document.removeEventListener('keydown', handleKeydown);
  }

  function init() {
    closeButton.addEventListener('click', close);
    modalContainer.addEventListener('click', close);
    sizeButtons.forEach((button, index) => {
      button.addEventListener('click', () => selectSize(index));
    });
    additiveButtons.forEach((button, index) => {
      button.addEventListener('click', () => toggleAdditive(index));
    });
  }

  return { init, open };
}
