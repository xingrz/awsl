import { getValue, setValue } from './kv';
import { $, $$, on, style, toggle, create, insertBefore, append, attrs } from './dom';

const DEFAULT_WORDS = '草;awsl';
const MAX_WORDS = 3;

async function recreateButtonsV6(buttonBar: HTMLElement, extraBar: HTMLElement, textarea: HTMLInputElement, submit: HTMLElement) {
  for (const btn of $$(buttonBar, '.awsl-button')) {
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
      if (textarea.value == '请输入转发理由') {
        textarea.value = '';
      }
      textarea.value = word + textarea.value;
      submit.click();
      for (const btn of buttons) {
        btn.classList.add('W_btn_b_disable');
      }
    });
    buttons.push(button);
    return button;
  }

  for (const word of words.slice(0, MAX_WORDS)) {
    insertBefore(buttonBar, submit, () => style(createButton(word), {
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

async function handleDocumentChangesV6() {
  const forwardLayer = $<HTMLElement>(document, '.layer_forward:not([awsl="yes"])');
  if (!forwardLayer) return;

  const textarea = $<HTMLInputElement>(forwardLayer, '.WB_publish textarea.W_input');
  const publishBar = $<HTMLElement>(forwardLayer, '.WB_publish .p_opt');
  if (!textarea || !publishBar) return;

  const buttonBar = $<HTMLElement>(publishBar, '.btn.W_fr');
  const optionBar = $<HTMLElement>(publishBar, '.opt');
  if (!buttonBar || !optionBar) return;

  const limitsBar = $<HTMLElement>(buttonBar, '.limits');
  const submit = $<HTMLElement>(buttonBar, '.W_btn_a[node-type="submit"]');
  if (!limitsBar || !submit) return;

  forwardLayer.setAttribute('awsl', 'yes');

  style(buttonBar, {
    'float': 'none',
    'display': 'flex',
    'justify-content': 'flex-end',
  });

  const extraBar = insertBefore(publishBar, optionBar, () => style(create('div'), {
    'display': 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'flex-end',
    'gap': '8px',
  }));

  const configDiv = insertBefore(publishBar, optionBar, () => {
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

  const configInput = $<HTMLInputElement>(configDiv, '.awsl-config-input')!;
  on($<HTMLElement>(configDiv, '.awsl-config-save')!, 'click', async () => {
    await setValue('words', configInput.value);
    await recreateButtonsV6(buttonBar, extraBar, textarea, submit);
    style(configDiv, { 'display': 'none' });
  });
  append(limitsBar, () => {
    const btn = create('a');
    btn.innerHTML = `
      <span class="W_autocut" style="width: auto;">配置转发</span>
      <i class="W_ficon ficon_set S_ficon_dis" style="margin: 0 0 0 2px; vertical-align: 4px;">*</i>
    `;
    attrs(btn, {
      'class': 'S_txt1',
      'href': 'javascript:void(0)',
    });
    on(btn, 'click', async () => {
      configInput.value = await getValue('words', DEFAULT_WORDS);
      toggle(configDiv, 'display', 'none', 'block');
      configInput.focus();
    });
    return btn;
  });

  await recreateButtonsV6(buttonBar, extraBar, textarea, submit);
}

const observer = new MutationObserver(() => {
  handleDocumentChangesV6();
});
observer.observe(document.body, { childList: true, subtree: true });
