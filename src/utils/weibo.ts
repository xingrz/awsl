import { create } from './dom';

export function createButton(text: string, type = 'default'): HTMLElement {
  return create('button', [
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
