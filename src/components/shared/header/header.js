const TABLET_BREAKPOINT = '(max-width: 768px)';

class BurgerMenu {
  constructor(button, nav) {
    this.button = button;
    this.nav = nav;
    this.lineTop = button.querySelector('.header-burger__line.top');
    this.lineBottom = button.querySelector('.header-burger__line.bottom');
    this.mediaQuery = matchMedia(TABLET_BREAKPOINT);
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
    this.nav.classList.add('burger-open');
    this.lineTop.classList.add('opened');
    this.lineBottom.classList.add('opened');
    this.button.setAttribute('aria-label', 'Close menu');
    this.button.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-locked');
  }

  close() {
    this.isOpen = false;
    this.nav.classList.remove('burger-open');
    this.lineTop.classList.remove('opened');
    this.lineBottom.classList.remove('opened');
    this.button.setAttribute('aria-label', 'Open menu');
    this.button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-locked');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  init() {
    this.button.addEventListener('click', () => this.toggle());

    this.nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) this.close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) this.close();
    });

    this.mediaQuery.addEventListener('change', (event) => {
      if (!event.matches && this.isOpen) this.close();
    });
  }
}

const burgerButton = document.querySelector('.header-burger');
const nav = document.getElementById('primary-navigation');

if (burgerButton && nav) {
  new BurgerMenu(burgerButton, nav).init();
}
