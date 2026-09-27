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

  function resetParams() {
    sizeButtons.forEach((button, index) => {
      const isDefault = index === 0;

      button.classList.toggle('active', isDefault);
      button.disabled = isDefault;
    });
    additiveButtons.forEach((button) => button.classList.remove('active'));
  }

  function fillContent(product, imageUrl) {
    photo.src = imageUrl;
    photo.alt = product.name;
    nameEl.textContent = product.name;
    aboutEl.textContent = product.description;
    priceEl.textContent = product.price;

    fillProductSizeButtons(product);
    fillProductAdditiveButtons(product);
    resetParams();
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
  }

  return { init, open };
}
