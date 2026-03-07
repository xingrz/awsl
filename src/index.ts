import type { ComponentInternalInstance } from 'vue';
import { loadModules } from '@/module';
import { dispatchInit, dispatchMounted } from '@/hooks';
import { $, attrs, observe } from '@/utils/dom';
import type { VueHTMLElement } from '@/utils/vue';

import './mods/auto_dark_mode';
import './mods/expand_pics';
import './mods/expand_replies';
import './mods/fast_forward';
import './mods/logo_click';
// TODO: settings is not yet migrated to Vue 3, see settings.ts for details
// import './mods/settings';
import './mods/user_remark';

observe(document.body, (_, observer) => {
  const root = $<VueHTMLElement>(document, '[data-v-app]:not([awsl-root="yes"])');
  if (!root) return;
  attrs(root, { 'awsl-root': 'yes' });
  observer.disconnect();

  console.log('[AWSL] Vue app found, installing mixin');

  const vue = root.__vue_app__;
  vue.mixin({
    mounted() {
      const instance = this._ as ComponentInternalInstance;
      dispatchMounted(instance, vue);
    },
  });

  dispatchInit(vue);
});

loadModules();
