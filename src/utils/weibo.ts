import { $, ICreator, append, create, on } from './dom';

export function createButton(text: string, type = 'default', classes: string[] = []): HTMLElement {
  return create('button', [
    ...classes,
    'woo-button-main',
    'woo-button-flat',
    `woo-button-${type}`,
    'woo-button-m',
    'woo-button-round',
  ], {}, [
    () => create('span', ['woo-button-wrap'], {}, [
      () => create('span', ['woo-button-content'], { html: text }),
    ]),
  ]);
}

export function createModal(title: string, content: (modal: HTMLElement) => ICreator<HTMLElement>[]): void {
  const app = $(document.body, '#app');
  if (!app) return;

  append(app, () => create('div', [
    'woo-box-flex',
    'woo-box-alignCenter',
    'woo-box-justifyCenter',
    'woo-modal-wrap',
  ], {}, [
    (modal) => create('div', ['woo-modal-main'], {}, [
      () => create('div', ['wbpro-layer'], {}, [
        () => create('div', ['woo-panel-main', 'woo-panel-bottom'], {}, [
          () => create('div', ['wbpro-layer-tit', 'woo-box-flex'], {}, [
            () => create('div', ['wbpro-layer-tit-text', 'woo-box-item-flex'], {
              style: { 'align-self': 'center' },
              html: title,
            }),
            () => {
              const close = create('div', [
                'wbpro-layer-tit-opt',
                'woo-box-flex',
                'woo-box-alignCenter',
                'woo-box-justifyCenter',
              ], {
                html: `<i class="woo-font woo-font--cross"></i>`,
              });
              return on(close, 'click', () => modal.remove());
            },
          ]),
        ]),
        ...content(modal),
      ]),
    ]),
    (modal) => {
      const mask = create('div', ['woo-modal-mask']);
      return on(mask, 'click', () => modal.remove());
    },
  ]));
}
