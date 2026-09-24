import { createSliderService } from './sliderService.js';

const sliderSection = document.querySelector('.slider');

if (sliderSection) {
  const {
    slider,
    nextSlideBtn,
    prevSlideBtn,
    prepareSlider,
    goToNextSlide,
    goToPreviousSlide,
    handleSlideTransitionEnd,
  } = createSliderService(sliderSection);

  prepareSlider();

  nextSlideBtn.addEventListener('click', goToNextSlide);
  prevSlideBtn.addEventListener('click', goToPreviousSlide);
  slider.addEventListener('transitionend', handleSlideTransitionEnd);
}
