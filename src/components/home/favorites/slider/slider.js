import { createSliderService } from './sliderService.js';

const sliderSection = document.querySelector('.slider');

if (sliderSection) {
  createSliderService(sliderSection).init();
}
