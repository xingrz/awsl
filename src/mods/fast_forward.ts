import { getValue } from '../utils/kv';
import { $, $$, $H, append, attrs, bind, create, observe, on } from '../utils/dom';
import { createButton } from '../utils/weibo';

const DEFAULT_WORDS = '草;awsl';

let words: string[] = [];
getValue('words', DEFAULT_WORDS).then(v => {
  words = v.split(';').filter(t => !!t);
});

interface IComposeBar {
  textarea: HTMLInputElement;
  submit: HTMLElement;
  composer: HTMLElement;
}

observe(document.body, function fastForward(): void {
  const composers = $$(document, '.Composer_mar1_ujs0j');
  for (const composer of composers) {
    const ctx = $H<IComposeBar>(composer.parentElement!, {
      textarea: '.Form_input_3JT2Q',
      submit: '.Composer_btn_2XFOD',
      composer: '.Composer_mar1_ujs0j',
    });
    if (!ctx) continue;

    const visibleLimits = $(ctx.composer, '.Visible_limits_11OKi');
    const isForward = !!visibleLimits;

    if (isForward) {
      bind(ctx.composer, 'awsl-fastforward', '1', () => setupButtons(ctx));
    } else {
      attrs(ctx.composer, { 'awsl-fastforward': null });
      destroyButtons(ctx);
    }
  }
});

function setupButtons(ctx: IComposeBar): HTMLElement {
  const buttons = append(ctx.composer, () => create('div', [
    'awsl-fastforward',
  ], {
    style: {
      'display': 'flex',
      'flex-wrap': 'wrap',
      'justify-content': 'flex-end',
      'gap': '4px 8px',
      'margin-top': '8px',
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

  return buttons;
}

function destroyButtons(ctx: IComposeBar): void {
  for (const el of $$(ctx.composer, '.awsl-fastforward')) {
    el.remove();
  }
}
