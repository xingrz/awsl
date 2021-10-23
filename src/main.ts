import { getValue, setValue } from './kv';
import { $, $H, $$, on, style, toggle, create, insertBefore, append, attrs } from './dom';

const DEFAULT_WORDS = '草;awsl';
const MAX_WORDS = 3;

interface IForwardLayerV6 {
  textarea: HTMLInputElement;
  p_opt: HTMLElement;
  btn: HTMLElement;
  opt: HTMLElement;
  ico: HTMLElement;
  ipt: HTMLElement;
  submit: HTMLElement;
}

async function recreateButtonsV6(ctx: IForwardLayerV6, extraBar: HTMLElement): Promise<void> {
  for (const btn of $$(ctx.btn, '.awsl-button')) {
    btn.remove();
  }
  extraBar.innerHTML = '';

  const buttons: HTMLElement[] = [];
  const words = (await getValue('words', DEFAULT_WORDS)).split(';').filter(t => !!t);

  function createButton(word: string): HTMLElement {
    const button = create('a');
    button.innerHTML = word;
    attrs(button, {
      'class': ['awsl-button', 'W_btn_b'].join(' '),
      'title': word,
      'href': 'javascript:void(0)',
    });
    on(button, 'click', () => {
      if (ctx.textarea.value == '请输入转发理由') {
        ctx.textarea.value = '';
      }
      ctx.textarea.value = word + ctx.textarea.value;
      ctx.submit.click();
      for (const btn of buttons) {
        btn.classList.add('W_btn_b_disable');
      }
    });
    buttons.push(button);
    return button;
  }

  for (const word of words.slice(0, MAX_WORDS)) {
    insertBefore(ctx.btn, ctx.submit, () => style(createButton(word), {
      'vertical-align': 'top',
      'margin-right': '8px',
      'max-width': '50px',
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
    }));
  }
  for (const word of words.slice(MAX_WORDS)) {
    append(extraBar, () => createButton(word));
  }
  if (words.length > MAX_WORDS) {
    style(extraBar, { 'margin-bottom': '16px' });
  }
}

function createConfigV6(ctx: IForwardLayerV6, onSave: () => void): void {
  const container = insertBefore(ctx.p_opt, ctx.opt, () => {
    const div = create('div');
    style(div, {
      'display': 'none',
      'margin-bottom': '16px',
      'text-align': 'left',
    });
    div.innerHTML = `
      <div style="margin-bottom: 2px">转发词组（以分号 ";" 间隔）：</div>
      <div style="display: flex;">
        <input class="awsl-config-input W_input" style="flex: 1;" />
        <a class="awsl-config-save W_btn_b" href="javascript:void(0)" style="margin-top: 2px; margin-left: 8px;">
          保存
        </a>
      </div>
    `;
    return div;
  });

  const config = $H<{ input: HTMLInputElement, save: HTMLElement }>(container, {
    input: '.awsl-config-input',
    save: '.awsl-config-save',
  })!;

  on(config.save, 'click', async () => {
    await setValue('words', config.input.value);
    style(container, { 'display': 'none' });
    onSave();
  });
  insertBefore(ctx.opt, ctx.ipt, () => {
    const btn = create('a');
    btn.innerHTML = `
      <span class="W_autocut" style="width: auto;">配置转发</span>
      <i class="W_ficon ficon_set S_ficon_dis">*</i>
    `;
    attrs(btn, {
      'class': 'S_txt1',
      'href': 'javascript:void(0)',
    });
    style(btn, {
      'float': 'right',
    });
    on(btn, 'click', async () => {
      config.input.value = await getValue('words', DEFAULT_WORDS);
      toggle(container, 'display', 'none', 'block');
      config.input.focus();
    });
    return btn;
  });
}

async function handleDocumentChangesV6(): Promise<void> {
  const forwardLayer = $<HTMLElement>(document, '.layer_forward:not([awsl="yes"])');
  if (!forwardLayer) return;

  const ctx = $H<IForwardLayerV6>(forwardLayer, {
    textarea: '[node-type="textEl"]',
    p_opt: '.p_opt',
    btn: '.p_opt .btn.W_fr',
    opt: '[node-type="widget"]',
    ico: '[node-type="widget"] .ico',
    ipt: '[node-type="cmtopts"]',
    submit: '[node-type="submit"]',
  });
  if (!ctx) return;

  // 标记为已改造
  attrs(forwardLayer, { 'awsl': 'yes' });

  // 调整转发按钮和表情按钮的浮动关系
  style(ctx.btn, {
    'float': 'none',
    'display': 'flex',
    'justify-content': 'flex-end',
    'margin-left': '60px',
  });
  style(ctx.ico, {
    'float': 'left',
  });
  ctx.p_opt.insertBefore(ctx.ico, ctx.btn);

  // 新增一块区域用于超过3个的转发词
  const extraBar = insertBefore(ctx.p_opt, ctx.opt, () => style(create('div'), {
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'flex-end',
    'gap': '8px',
  }));

  // 创建配置区
  createConfigV6(ctx, async () => {
    await recreateButtonsV6(ctx, extraBar);
  });

  // 填充转发词
  await recreateButtonsV6(ctx, extraBar);
}

const observer = new MutationObserver(() => {
  handleDocumentChangesV6();
});
observer.observe(document.body, { childList: true, subtree: true });
