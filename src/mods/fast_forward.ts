import { getValue } from '../utils/kv';
import { $H, $$, on, style, create, append, attrs, html, observe } from '../utils/dom';

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
