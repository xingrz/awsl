import { getValue, setValue } from '../utils/kv';
import { $, $$, $H, ICreator, append, attrs, bind, create, insertBefore, observe, on } from '../utils/dom';
import { createButton, createModal } from '../utils/weibo';

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
      bind(ctx.composer, 'awsl-fastforward', '1', () => {
        setupButtons(ctx);
        setupMenus(ctx, visibleLimits);
      });
    } else {
      attrs(ctx.composer, { 'awsl-fastforward': null });
      destroyButtons(ctx);
      destroyMenus(ctx);
    }
  }
});

function setupButtons(ctx: IComposeBar): HTMLElement {
  const buttons = append(ctx.composer, () => create('div', [
    'awsl-fastforward',
    'woo-box-flex',
    'woo-box-wrap',
    'woo-box-justifyEnd',
  ], {
    style: {
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

function setupMenus(ctx: IComposeBar, visibleLimits: HTMLElement): void {
  function insertMenu(text: string): HTMLElement {
    const menu = create('span', [], {
      style: {
        'cursor': 'pointer',
        'user-select': 'none',
      },
      html: text,
    });

    insertBefore(visibleLimits.parentNode!, visibleLimits, () => create('div', [
      'woo-panel-main',
      'woo-panel-right',
      'awsl-fastforward-menu',
    ], {
      style: {
        'font-size': '14px',
        'color': 'var(--w-sub)',
        'margin-right': '10px',
        'padding-right': '10px',
      },
    }, [() => menu]));

    return menu;
  }

  const custom = insertMenu('自定义');
  on(custom, 'click', () => showCustom(ctx));
}

function destroyMenus(ctx: IComposeBar): void {
  for (const el of $$(ctx.composer, '.awsl-fastforward-menu')) {
    el.remove();
  }
}

function createModalWithButtons(
  title: string,
  content: ICreator<HTMLElement>,
  cancelText: string,
  okText: string,
  onOk: (modal: HTMLElement) => void
): void {
  return createModal(title, (modal) => [
    () => content(modal),
    () => create('div', [
      'wbpro-layer-btn',
      'woo-box-flex',
      'woo-box-justifyCenter',
    ], {}, [
      () => {
        const close = createButton(cancelText, 'default', ['wbpro-layer-btn-item']);
        on(close, 'click', () => modal.remove());
        return close;
      },
      () => {
        const save = createButton(okText, 'primary', ['wbpro-layer-btn-item']);
        on(save, 'click', () => {
          onOk(modal);
          modal.remove();
        });
        return save;
      },
    ]),
  ]);
}

function showCustom(ctx: IComposeBar): void {
  const container = create('div', [
    'woo-box-flex',
    'woo-box-wrap',
  ], {
    style: {
      'padding': '20px 20px 0',
      'gap': '8px',
    },
  });

  function createIconBtn(title: string, icon: string): HTMLElement {
    return create('i', ['woo-font', `woo-font--${icon}`], {
      style: {
        'color': 'var(--w-fonticon)',
        'cursor': 'pointer',
        'margin': '0 8px',
      },
      attrs: { title },
    });
  }

  function createItemWrap(): HTMLElement {
    return create('div', [
      'woo-box-flex',
      'woo-box-alignCenter',
    ], {
      style: {
        'border': '1px solid var(--w-color-gray-7)',
        'border-radius': 'var(--w-border-radius)',
        'color': 'var(--w-main)',
        'font-size': '13px',
        'height': '28px',
      },
    });
  }

  let currentWords = [...words];

  function fillWords() {
    container.innerHTML = '';

    for (const word of currentWords) {
      const wrap = append(container, () => createItemWrap());

      append(wrap, () => create('span', [], {
        style: {
          'padding': '4px 8px',
        },
        html: word,
      }));

      const del = append(wrap, () => createIconBtn('删除', 'cross'));
      on(del, 'click', () => {
        currentWords = currentWords.filter(t => t != word);
        fillWords();
      });
    }

    {
      const wrap = append(container, () => createItemWrap());

      const input = append(wrap, () => create<HTMLInputElement>('input', [], {
        style: {
          'padding': '4px 8px',
          'color': 'var(--w-main)',
          'font-size': '13px',
          'border': 'none',
          'outline': 'none',
          'background': 'none',
        },
        attrs: { placeholder: '添加短语' },
      }));

      const add = append(wrap, () => createIconBtn('添加', 'check'));
      on(add, 'click', () => {
        const value = input.value.trim();
        if (value) {
          currentWords.push(value);
          input.value = '';
          fillWords();
        }
      });
    }
  }

  fillWords();

  createModalWithButtons('自定义一键转发', (_modal) => container, '关闭', '保存', async (_modal) => {
    words = [...currentWords];
    await setValue('words', words.join(';'));
    destroyButtons(ctx);
    setupButtons(ctx);
  });
}
