import { getValue, setValue } from '../utils/kv';
import { $, $$, $H, ICreator, append, attr, attrs, bind, create, html, insertBefore, observe, on, style } from '../utils/dom';
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
    events: {
      click: (e) => {
        const word = attr(e.target as HTMLElement, 'data-awsl-word');
        if (word) {
          e.stopPropagation();
          ctx.textarea.value = word + ctx.textarea.value;
          ctx.textarea.dispatchEvent(new Event('input'));
          setTimeout(() => {
            ctx.submit.click();
          }, 200);
        }
      },
    },
  }));

  for (const word of words) {
    const button = append(buttons, () => createButton(word));
    attrs(button, { 'data-awsl-word': word });
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

  if (ctx.textarea.value.length > 0) {
    const edit = insertMenu('编辑');
    on(edit, 'click', () => toggleEdit(ctx, edit));
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

  const currentWords = [...words];

  const add = append(container, () => {
    const wrap = createItemWrap();

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

    const btn = append(wrap, () => createIconBtn('添加', 'check'));
    on(btn, 'click', () => {
      const value = input.value.trim();
      if (value) {
        currentWords.push(value);
        input.value = '';
        fillWords();
      }
    });

    return wrap;
  });

  on(container, 'click', (e) => {
    if ((e.target as HTMLElement).matches('[data-awsl-word-index]')) {
      e.stopPropagation();
      const index = Number(attr(e.target as HTMLElement, 'data-awsl-word-index'));
      currentWords.splice(index, 1);
      fillWords();
    }
  });

  function fillWords() {
    for (const el of $$(container, '[data-awsl-word]')) {
      el.remove();
    }

    for (const [index, word] of currentWords.entries()) {
      const wrap = insertBefore(container, add, () => createItemWrap());
      attrs(wrap, { 'data-awsl-word': word });

      append(wrap, () => create('span', [], {
        style: {
          'padding': '4px 8px',
        },
        html: word,
      }));

      const del = append(wrap, () => createIconBtn('删除', 'cross'));
      attrs(del, { 'data-awsl-word-index': String(index) });
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

function toggleEdit(ctx: IComposeBar, editBtn: HTMLElement): void {
  const container = ctx.textarea.parentElement!;
  const isEditing = ctx.textarea.style.display == 'none';

  if (isEditing) {
    $(container, '.awsl-editing')?.remove();

    style(ctx.textarea, { 'display': '' });

    // Need some tricks to refresh the size of textarea
    const value = ctx.textarea.value;
    ctx.textarea.value = value + ' ';
    ctx.textarea.dispatchEvent(new Event('input'));
    setTimeout(() => {
      ctx.textarea.value = value;
      ctx.textarea.dispatchEvent(new Event('input'));
      ctx.textarea.focus();
      ctx.textarea.setSelectionRange(0, 0);
    }, 0);

    style(editBtn, { 'color': '' });
    html(editBtn, '编辑');
  } else {
    const [first, ...others] = escapeLinks(ctx.textarea.value).split('//').map(unescapeLinks);

    if (others.length == 0) {
      ctx.textarea.focus();
      return;
    }

    style(ctx.textarea, { 'display': 'none' });
    container.classList.add('focus');

    const editor = append(container, () => create('div', [
      'awsl-editing',
      'woo-box-flex',
      'woo-box-column',
    ], {
      style: {
        'gap': '2px',
      },
    }));

    const items: HTMLElement[] = [];

    function updateTextarea(): void {
      const values = items
        .filter(item => attr(item, 'data-awsl-removed') != 'yes')
        .map(item => attr(item, 'data-awsl-text'));

      ctx.textarea.value = [first, ...values].join('//');
      ctx.textarea.dispatchEvent(new Event('input'));
    }

    for (const item of others) {
      const [_match, _prefix, name, text] = item.match(/^(([^\:]+)\:)?(.*)$/) || [];

      const wrap = append(editor, () => create('label', [
        'woo-box-flex',
        'woo-box-alignStart',
      ], {
        style: {
          'gap': '4px',
          'cursor': 'pointer',
          'user-select': 'none',
        },
        attrs: {
          'data-awsl-text': item,
          'data-awsl-removed': 'no',
        },
      }));
      items.push(wrap);

      append(wrap, () => create('input', [], {
        style: {
          'width': 'auto',
          'margin': '6px 0',
        },
        attrs: {
          'type': 'checkbox',
          'checked': 'yes',
        },
        events: {
          change: (e) => {
            attrs(wrap, { 'data-awsl-removed': (e.target as HTMLInputElement).checked ? 'no' : 'yes' });
            updateTextarea();
          },
        },
      }));

      const nameHtml = name
        ? `<span style="color: var(--w-alink)">${name}</span>: `
        : '';

      const textHtml = text
        ? `<span style="color: var(--w-main)">${text}</span>`
        : `<span style="color: var(--w-sub)">(空)</span>`;

      append(wrap, () => create('span', [], { html: `${nameHtml}${textHtml}` }));
    }

    style(editBtn, { 'color': 'var(--w-brand)' });
    html(editBtn, '完成');
  }
}

function escapeLinks(value: string): string {
  return value.replace(/(http|https)\:\/\//g, '$1:$$$$');
}

function unescapeLinks(value: string): string {
  return value.replace(/(http|https)\:\$\$/g, '$1://');
}
