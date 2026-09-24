export function createSliderService(sliderSection) {
  const viewport = sliderSection.querySelector('.slider__viewport');
  const track = sliderSection.querySelector('.slider__track');
  const slides = [...track.children];
  const slideCount = slides.length;
  const SLIDE_SHIFT_PERCENT = 100;
  const SWIPE_THRESHOLD_PX = 50;

  const nextSlideBtn = sliderSection.querySelector('.btn-arrow.right');
  const prevSlideBtn = sliderSection.querySelector('.btn-arrow.left');
  const paginationLines = [...sliderSection.querySelectorAll('.pagination__line')];
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentIndex = 1;
  let isAnimationInProgress = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function createClone(slide) {
    const clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');

    return clone;
  }

  function setTrackPosition(slideIndex) {
    track.style.transform = `translateX(-${slideIndex * SLIDE_SHIFT_PERCENT}%)`;
  }

  function prepareSlider() {
    track.prepend(createClone(slides.at(-1)));
    track.append(createClone(slides[0]));
    setTrackPosition(currentIndex);
    void track.offsetWidth;
    track.classList.add('is-ready');
  }

  function setActivePaginationLine(slideIndex) {
    const activeIndex = (slideIndex - 1 + slideCount) % slideCount;

    paginationLines.forEach((line, i) => {
      line.classList.toggle('active', i === activeIndex);
    });
  }

  function enableAnimation(element) {
    element.style.removeProperty('transition');
  }

  function disableAnimation(element) {
    element.style.transition = 'none';
  }

  function finishSlideTransition() {
    const isOnCloneSlide = currentIndex === 0 || currentIndex === slideCount + 1;

    if (isOnCloneSlide) {
      disableAnimation(track);
      currentIndex = currentIndex === 0 ? slideCount : 1;
      setTrackPosition(currentIndex);
      void track.offsetWidth;

      enableAnimation(track);
    }

    isAnimationInProgress = false;
  }

  function goToSlide(slideIndex) {
    if (isAnimationInProgress) return;

    isAnimationInProgress = true;
    currentIndex = slideIndex;
    setActivePaginationLine(slideIndex);
    setTrackPosition(slideIndex);

    // Without animation there is no `transitionend`, so finish the move right away
    if (reducedMotionQuery.matches) finishSlideTransition();
  }

  function handleSlideTransitionEnd(event) {
    if (event.target !== track || event.propertyName !== 'transform') return;

    finishSlideTransition();
  }

  function goToNextSlide() {
    goToSlide(currentIndex + 1);
  }

  function goToPreviousSlide() {
    goToSlide(currentIndex - 1);
  }

  function handleTouchStart(event) {
    const { clientX, clientY } = event.changedTouches[0];

    touchStartX = clientX;
    touchStartY = clientY;
  }

  function handleTouchEnd(event) {
    const { clientX, clientY } = event.changedTouches[0];
    const deltaX = clientX - touchStartX;
    const deltaY = clientY - touchStartY;

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    if (!isHorizontalSwipe || Math.abs(deltaX) < SWIPE_THRESHOLD_PX) return;

    if (deltaX < 0) {
      goToNextSlide();
    } else {
      goToPreviousSlide();
    }
  }

  function init() {
    prepareSlider();

    nextSlideBtn.addEventListener('click', goToNextSlide);
    prevSlideBtn.addEventListener('click', goToPreviousSlide);
    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewport.addEventListener('touchend', handleTouchEnd, { passive: true });
    track.addEventListener('transitionend', handleSlideTransitionEnd);
    track.addEventListener('transitioncancel', handleSlideTransitionEnd);
  }

  return { init };
}
