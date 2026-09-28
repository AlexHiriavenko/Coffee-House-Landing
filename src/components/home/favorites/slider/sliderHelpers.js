export function createClone(slide) {
  const clone = slide.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');

  return clone;
}

export function enableAnimation(element) {
  element.style.removeProperty('transition');
}

export function disableAnimation(element) {
  element.style.transition = 'none';
}
