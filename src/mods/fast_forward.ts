import { registerModule } from '@/module';
import { onUpdated } from '@/hooks';
import { getValue, setValue } from '@/utils/kv';
import { $, $$, $H, ICreator, append, attr, attrs, create, html, insertBefore, on, style } from '@/utils/dom';
import { createButton, createChip, createModal } from '@/utils/weibo';

const DEFAULT_WORDS = '草;awsl';

let words: string[] = [];

interface IComposeBar {
  textarea: HTMLInputElement;
  submit: HTMLElement;
  composer: HTMLElement;
}

registerModule({
  id: 'fast_forward',
  name: '一键转发短语',
  defaultEnabled: true,
  setup() {
    getValue('words', DEFAULT_WORDS).then(v => {
      words = v.split(';').filter(t => !!t);
    });

    onUpdated('Composer', (instance) => {
      const composer = instance.vnode.el as HTMLElement | null;
      if (!composer) return;

      const ctx = $H<{
        textarea: HTMLInputElement;
        submit: HTMLElement;
      }>(composer, {
        textarea: 'textarea[class*="_input_"]',
        submit: 'button.woo-button-primary',
      });
      if (!ctx) return;

      const visibleLimits = $<HTMLElement>(composer, '[class*="_limits_"]');
      const alreadySetup = $(composer, '.awsl-fastforward');

      if (!visibleLimits) {
        destroyButtons({ ...ctx, composer });
        destroyMenus({ ...ctx, composer });
      } else if (!alreadySetup) {
        setupButtons({ ...ctx, composer });
        setupMenus({ ...ctx, composer }, visibleLimits);
      }
    });
  },
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

  const currentWords = [...words];

  const add = append(container, () => {
    const input = create<HTMLInputElement>('input', [], {
      style: {
        'padding': '4px',
        'color': 'var(--w-main)',
        'font-size': '13px',
        'border': 'none',
        'outline': 'none',
        'background': 'none',
      },
      attrs: { placeholder: '添加短语' },
    });

    const chip = createChip('add', () => input, () => {
      const value = input.value.trim();
      if (value) {
        currentWords.push(value);
        input.value = '';
        fillWords();
      }
    });

    return chip;
  });

  function fillWords() {
    for (const el of $$(container, '[data-awsl-word]')) {
      el.remove();
    }

    for (const [index, word] of currentWords.entries()) {
      insertBefore(container, add, () => {
        const chip = createChip('close',
          (content) => html(content, word),
          () => {
            currentWords.splice(index, 1);
            fillWords();
          });
        return attrs(chip, { 'data-awsl-word': word });
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
      const [_match, _prefix, name, text] = item.match(/^(([^:]+):)?(.*)$/) || [];

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
  return value.replace(/(http|https):\/\//g, '$1:$$$$');
}

function unescapeLinks(value: string): string {
  return value.replace(/(http|https):\$\$/g, '$1://');
}
