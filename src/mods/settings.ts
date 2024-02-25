import { $, attrs, create, observe, on } from '../utils/dom';
import { VueHTMLElement } from '../utils/vue';
import { createButton, createModal } from '../utils/weibo';

type IConfigItem = {
  name: string;
  divider?: boolean;
} & ({
  type?: string;
  href: string;
} | {
  type: 'rouer';
  routerName: string;
  routerPath: string;
} | {
  type: string;
});

observe(document.body, function settings(): void {
  const nav = $(document, '.Nav_popcon__F1hb:not([awsl="yes"])');
  if (!nav) return;
  attrs(nav, { 'awsl': 'yes' });

  for (const item of nav.children) {
    if (!$(item, '[*|href="#woo_svg_nav_configFlat"]')) continue;

    const navItem = item as VueHTMLElement;
    if (!navItem.__vue__) return;

    const vue = navItem.__vue__;

    const { configItems } = vue.$options.propsData as {
      configItems: IConfigItem[];
    };

    configItems.splice(-1, 0, { name: 'AWSL 设置', type: 'awsl' });

    vue.$on('config-item-tap', (idx: number) => {
      const item = configItems[idx];
      if (item?.type == 'awsl') {
        showSetings();
      }
    });
  }
});

function showSetings() {
  createModal('AWSL 设置', (modal) => [
    () => create('div', [], { html: 'hello' }),
    () => create('div', [
      'wbpro-layer-btn',
      'woo-box-flex',
      'woo-box-justifyCenter',
    ], {}, [
      () => {
        const close = createButton('取消', 'default', ['wbpro-layer-btn-item']);
        on(close, 'click', () => modal.remove());
        return close;
      },
      () => {
        const save = createButton('保存', 'primary', ['wbpro-layer-btn-item']);
        on(save, 'click', () => {
          modal.remove();
        });
        return save;
      },
    ]),
  ]);
}
