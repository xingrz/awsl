import { getValue } from './kv';
import { $H, $$, on, style, create, append, attrs, html, $ } from './dom';

const DEFAULT_WORDS = '草;awsl';

new MutationObserver(() => {
  adjustSubmit();
  adjustRouter();
  adjustNavItems();
  removeAds();
}).observe(document.body, { childList: true, subtree: true });

async function adjustSubmit(): Promise<void> {
  const composers = $$(document, '.Composer_mar1_ujs0j:not([awsl="yes"])');
  if (!composers.length) return;

  const words = (await getValue('words', DEFAULT_WORDS)).split(';').filter(t => !!t);

  for (const composer of composers) {
    attrs(composer as HTMLElement, { 'awsl': 'yes' });
    injectButtons(composer.parentElement!, words);
  }
}

interface IComposeBar {
  textarea: HTMLInputElement;
  submit: HTMLElement;
  composer: HTMLElement;
}

function injectButtons(container: HTMLElement, words: string[]): void {
  const ctx = $H<IComposeBar>(container, {
    textarea: '.Form_input_3JT2Q',
    submit: '.Composer_btn_2XFOD',
    composer: '.Composer_mar1_ujs0j',
  });
  if (!ctx) return;

  const buttons = append(ctx.composer, () => create('div'));
  style(buttons, {
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'flex-end',
    'gap': '4px 8px',
    'margin-top': '4px',
  });

  for (const word of words) {
    const button = createButton(word);
    on(button, 'click', () => {
      ctx.textarea.value = word + ctx.textarea.value;
      ctx.textarea.dispatchEvent(new Event('input'));
      setTimeout(() => {
        ctx.submit.click();
      }, 200);
    });
    buttons.appendChild(button);
  }
}

function createButton(text: string): HTMLElement {
  const content = create('span');
  html(content, text);
  attrs(content, { 'class': 'woo-button-content' });

  const wrap = create('span');
  attrs(wrap, { 'class': 'woo-button-wrap' });

  const button = create('button');
  attrs(button, {
    'class': [
      'woo-button-main',
      'woo-button-flat',
      'woo-button-default',
      'woo-button-m',
      'woo-button-round',
    ].join(' '),
  });

  button.appendChild(wrap);
  wrap.appendChild(content);
  return button;
}

interface VueHTMLElement<T> extends HTMLElement {
  __vue__?: IVue & T;
}

interface IVue {
  _router?: {
    beforeEach(hook: (
      to: IRoute,
      from: IRoute,
      next: (next?: false | string | IRoute) => void
    ) => void): void;
  };
}

interface IRoute {
  name: string;
  path?: string;
  query?: Record<string, string>;
  fullPath?: string;
}

interface IApp {
  config?: {
    uid: number;
  }
}

function adjustRouter(): void {
  const app = $<VueHTMLElement<IApp>>(document, '#app:not([awsl="yes"])');
  if (!app) return;

  const vue = app.__vue__;
  if (!vue) return;

  const uid = vue.config?.uid;
  if (!uid) return;

  const router = vue._router;
  if (!router) return;

  attrs(app, { 'awsl': 'yes' });

  router.beforeEach((to, _from, next) => {
    if (to.name == 'home') {
      next({
        name: 'mygroups',
        query: {
          gid: `11000${uid}`,
        },
      });
    } else {
      next();
    }
  });
}

interface INavContext {
  app: VueHTMLElement<IApp>;
  logo: HTMLElement;
  tabHome: HTMLElement;
}

function adjustNavItems(): void {
  const navAll = $(document, '.Nav_inner_1QCVO a.ALink_none_1w6rm[href="/"]:not([awsl="yes"])');
  if (navAll) {
    style(navAll, { 'display': 'none' });
    attrs(navAll, { 'awsl': 'yes' });
  }

  const ctx = $H<INavContext>(document, {
    app: '#app',
    logo: '.Nav_logoWrap_2fPbO[href="/"]',
    tabHome: '.woo-tab-nav a.Ctrls_alink_1L3hP[href="/"]',
  });
  if (!ctx) return;

  const uid = ctx.app.__vue__?.config?.uid;
  if (!uid) return;

  attrs(ctx.logo, {
    'href': `/mygroups?gid=11000${uid}`,
  });

  attrs(ctx.tabHome, {
    'href': `/mygroups?gid=11000${uid}`,
  });
}

function removeAds(): void {
  const ads = $$(document, '.TipsAd_wrap_3QB_0');
  for (const ad of ads) {
    ad.remove();
  }
}
