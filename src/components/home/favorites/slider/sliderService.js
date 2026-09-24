export function createSliderService(sliderSection) {
  const slider = sliderSection.querySelector('.slide.start');
  const slides = [...slider.children];
  const slideCount = slides.length;
  const SLIDE_SHIFT_PERCENT = 100;

  const nextSlideBtn = sliderSection.querySelector('.btn-arrow.right');
  const prevSlideBtn = sliderSection.querySelector('.btn-arrow.left');
  const paginationLines = [...sliderSection.querySelectorAll('.pagination__line')];

  let currentIndex = 1;
  let isAnimationInProgress = false;

  function updatePagination(index) {
    const activeIndex = (index - 1 + slideCount) % slideCount;

    paginationLines.forEach((line, i) => {
      line.classList.toggle('active', i === activeIndex);
    });
  }

  function goToSlide(index) {
    if (isAnimationInProgress) return;

    isAnimationInProgress = true;
    currentIndex = index;
    updatePagination(index);
    slider.style.transform = `translateX(-${index * SLIDE_SHIFT_PERCENT}%)`;
  }

  function enableAnimation(element) {
    element.style.removeProperty('transition');
  }

  function disableAnimation(element) {
    element.style.transition = 'none';
  }

  function handleSlideTransitionEnd(event) {
    if (event.target !== slider || event.propertyName !== 'transform') return;

    const isOnCloneSlide = currentIndex === 0 || currentIndex === slideCount + 1;

    if (isOnCloneSlide) {
      disableAnimation(slider);
      currentIndex = currentIndex === 0 ? slideCount : 1;
      slider.style.transform = `translateX(-${currentIndex * SLIDE_SHIFT_PERCENT}%)`;
      void slider.offsetWidth;

      enableAnimation(slider);
    }

    isAnimationInProgress = false;
  }

  function prepareSlider() {
    slider.prepend(slides.at(-1).cloneNode(true));
    slider.append(slides[0].cloneNode(true));
    slider.style.transform = `translateX(-${SLIDE_SHIFT_PERCENT}%)`;
    void slider.offsetWidth;
    slider.classList.add('is-ready');

    currentIndex = 1;
    isAnimationInProgress = false;
  }

  function goToNextSlide() {
    goToSlide(currentIndex + 1);
  }

  function goToPreviousSlide() {
    goToSlide(currentIndex - 1);
  }

  return {
    slider,
    nextSlideBtn,
    prevSlideBtn,
    prepareSlider,
    goToNextSlide,
    goToPreviousSlide,
    handleSlideTransitionEnd,
  };
}
