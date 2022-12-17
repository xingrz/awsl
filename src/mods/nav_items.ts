import { $H, style, attrs, $, observe } from '../utils/dom';
import { IApp, VueHTMLElement } from '../utils/vue';

interface INavContext {
  app: VueHTMLElement<IApp>;
  logo: HTMLElement;
  tabHome: HTMLElement;
}

observe(document.body, function adjustNavItems(): void {
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
});
