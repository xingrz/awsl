import { $, attrs, observe, on } from '../utils/dom';
import { IApp, VueHTMLElement } from '../utils/vue';

observe(document.body, function logoClick(): void {
  const app = $<VueHTMLElement<IApp>>(document, '#app:not([awsl-logoclick="yes"])');
  if (!app) return;
  attrs(app, { 'awsl-logoclick': 'yes' });

  const vue = app.__vue__;
  if (!vue) return;

  const uid = vue.config?.uid;
  if (!uid) return;

  const oldLogo = $<HTMLElement>(app, '.Nav_logoWrap_2fPbO');
  if (!oldLogo) return;
  oldLogo.outerHTML = oldLogo.outerHTML;

  const newLogo = $<HTMLElement>(app, '.Nav_logoWrap_2fPbO')!;

  attrs(newLogo, {
    'href': `/mygroups?gid=11000${uid}`,
  });

  on(newLogo, 'click', (e) => {
    e.preventDefault();

    vue.$router.push({
      name: 'mygroups',
      query: { gid: `11000${uid}` },
    });

    // Ensure timeline is reloaded
    if (vue.$store.state.feed.feedGroup.left) {
      const curIndex = 1;
      const navItem = vue.$store.state.feed.feedGroup.left[curIndex];
      vue.$Bus.$emit('handleHomeNav', navItem, curIndex, 'left');
    }
  });
});
