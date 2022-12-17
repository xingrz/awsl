import { attrs, $, observe } from '../utils/dom';
import { IApp, VueHTMLElement } from '../utils/vue';

observe(document.body, function adjustRouter(): void {
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
});
