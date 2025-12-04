import { registerModule } from '@/module';
import { $, attr } from '@/utils/dom';

const prefersColorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');

registerModule({
  id: 'auto_dark_mode',
  name: '跟随系统自动切换深色模式',
  defaultEnabled: true,
  init() {
    if (prefersColorSchemeQuery) {
      applyPreferredDarkMode(prefersColorSchemeQuery.matches);
      prefersColorSchemeQuery.addEventListener('change', handlePrefersColorSchemeChange);
    }
  },
  cleanup() {
    if (prefersColorSchemeQuery) {
      prefersColorSchemeQuery.removeEventListener('change', handlePrefersColorSchemeChange);
    }
  },
});

function handlePrefersColorSchemeChange(e: MediaQueryListEvent): void {
  applyPreferredDarkMode(e.matches);
}

function applyPreferredDarkMode(preferred: boolean): void {
  const themeButton = $(document.body, '.Dark_box_2i4rW button');
  const currentMode = attr(document.documentElement, 'data-theme');
  if (themeButton && (preferred != (currentMode === 'dark'))) {
    themeButton.click();
  }
}
