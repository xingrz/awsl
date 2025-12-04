import { disableModule, enableModule, getModules } from '@/module';
import { $, attrs, create, observe, on } from '@/utils/dom';
import { VueHTMLElement } from '@/utils/vue';
import { createButton, createModal } from '@/utils/weibo';

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

async function showSetings() {
  const modules = await getModules();
  const toggles: Record<string, HTMLInputElement> = {};

  createModal('AWSL 设置', (modal) => [
    () => create('div', [], {
      style: {
        'padding': '16px',
      },
    }, modules.map(({ module, enabled }) => () => {
      const toggle = create<HTMLInputElement>('input', [], {
        attrs: {
          type: 'checkbox',
          checked: enabled ? 'checked' : null,
        },
        style: {
          'margin-right': '8px',
        },
      });

      toggles[module.id] = toggle;

      return create('div', [], {}, [
        () => create('label', ['woo-box-flex', 'woo-box-alignCenter'], {
          style: {
            'cursor': 'pointer',
            'user-select': 'none',
            'margin-bottom': '8px',
          },
        }, [
          () => toggle,
          () => create('span', [], { html: module.name }),
        ]),
      ]);
    })),
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
        on(save, 'click', async () => {
          for (const { module, enabled } of modules) {
            const toggle = toggles[module.id];
            if (!toggle) continue;

            if (enabled && !toggle.checked) {
              await disableModule(module.id)
            } else if (!enabled && toggle.checked) {
              await enableModule(module.id);
            }
          }

          modal.remove();
        });
        return save;
      },
    ]),
  ]);
}
