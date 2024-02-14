import { getValue } from '../utils/kv';
import { $H, $$, on, create, append, attrs, observe } from '../utils/dom';

const DEFAULT_WORDS = '草;awsl';

observe(document.body, async function fastForward(): Promise<void> {
  const composers = $$(document, '.Composer_mar1_ujs0j:not([awsl="yes"])');
  if (!composers.length) return;

  const words = (await getValue('words', DEFAULT_WORDS)).split(';').filter(t => !!t);

  for (const composer of composers) {
    attrs(composer as HTMLElement, { 'awsl': 'yes' });
    injectButtons(composer.parentElement!, words);
  }
});

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

  const buttons = append(ctx.composer, () => create('div', [], {
    style: {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content': 'flex-end',
      'gap': '4px 8px',
      'margin-top': '4px',
    },
  }));

  for (const word of words) {
    const button = append(buttons, () => createButton(word));
    on(button, 'click', () => {
      ctx.textarea.value = word + ctx.textarea.value;
      ctx.textarea.dispatchEvent(new Event('input'));
      setTimeout(() => {
        ctx.submit.click();
      }, 200);
    });
  }
}

function createButton(text: string): HTMLElement {
  return create('button', [
    'woo-button-main',
    'woo-button-flat',
    'woo-button-default',
    'woo-button-m',
    'woo-button-round',
  ], {}, [
    () => create('span', ['woo-button-wrap'], {}, [
      () => create('span', ['woo-button-content'], { html: text }),
    ]),
  ]);
}
