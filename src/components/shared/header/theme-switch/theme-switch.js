class Theme {
  static STORAGE_KEY = 'theme';
  static THEMES = ['light', 'dark'];
  static TRANSITION_CLASS = 'theme-transition';
  static TRANSITION_MS = 350;

  constructor(root, buttons) {
    this.root = root;
    this.buttons = buttons;
    this.systemQuery = matchMedia('(prefers-color-scheme: dark)');
    this.transitionTimer = null;
  }

  get system() {
    return this.systemQuery.matches ? 'dark' : 'light';
  }

  get saved() {
    try {
      const saved = localStorage.getItem(Theme.STORAGE_KEY);
      return Theme.THEMES.includes(saved) ? saved : null;
    } catch {
      return null;
    }
  }

  save(theme) {
    try {
      localStorage.setItem(Theme.STORAGE_KEY, theme);
    } catch {}
  }

  apply(theme) {
    this.root.dataset.theme = theme;
    this.buttons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
    });
  }

  change(theme) {
    if (this.root.dataset.theme === theme) return;
    this.root.classList.add(Theme.TRANSITION_CLASS);
    this.apply(theme);
    clearTimeout(this.transitionTimer);
    this.transitionTimer = setTimeout(() => {
      this.root.classList.remove(Theme.TRANSITION_CLASS);
    }, Theme.TRANSITION_MS);
  }

  init() {
    this.buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.save(button.dataset.theme);
        this.change(button.dataset.theme);
      });
    });

    this.systemQuery.addEventListener('change', () => {
      if (!this.saved) this.change(this.system);
    });

    window.addEventListener('storage', (event) => {
      if (event.key === Theme.STORAGE_KEY || event.key === null) {
        this.change(this.saved ?? this.system);
      }
    });

    this.apply(this.saved ?? this.system);
  }
}

export const theme = new Theme(
  document.documentElement,
  document.querySelectorAll('.theme-switch__btn'),
);

theme.init();
