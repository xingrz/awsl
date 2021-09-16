// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      0.3.1
// @description  Auto AWSLing
// @author       XiNGRZ <hi@xingrz.me>
// @license      WTFPL
// @match        https://weibo.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @updateURL    https://raw.githubusercontent.com/xingrz/awsl/master/awsl.meta.js
// @downloadURL  https://raw.githubusercontent.com/xingrz/awsl/master/awsl.user.js
// @homepageURL  https://github.com/xingrz/awsl
// @supportURL   https://github.com/xingrz/awsl/issues
// ==/UserScript==

'use strict';

(() => {

  const DEFAULT_WORDS = '草;awsl';
  const MAX_WORDS = 3;

  async function recreateButtons(buttonBar, textarea, submit) {
    for (const btn of buttonBar.querySelectorAll('.awsl-button')) {
      btn.remove();
    }

    const buttons = [];
    const words = await GM.getValue('words', DEFAULT_WORDS);
    for (const word of words.split(';').filter(t => !!t).slice(0, MAX_WORDS)) {
      const button = document.createElement('a');
      button.className = 'awsl-button W_btn_b';
      button.style = 'vertical-align: top; margin-right: 8px; max-width: 50px; overflow: hidden; text-overflow: ellipsis;';
      button.innerHTML = word;
      button.title = word;
      button.href = 'javascript:void(0)';
      button.addEventListener('click', () => {
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
      buttonBar.insertBefore(button, submit);
    }
  }

  const observer = new MutationObserver(async () => {
    const forwardLayer = document.querySelector('.layer_forward:not([awsl="yes"])');
    if (!forwardLayer) return;

    const textarea = forwardLayer.querySelector('textarea.W_input');
    const buttonBar = forwardLayer.querySelector('.btn.W_fr');
    const limitsBar = buttonBar.querySelector('.limits');
    const submit = buttonBar.querySelector('.W_btn_a[node-type="submit"]');
    if (!textarea || !buttonBar || !limitsBar || !submit) return;

    forwardLayer.setAttribute('awsl', 'yes');

    buttonBar.style.float = 'none';
    buttonBar.style.textAlign = 'right';

    const configDiv = document.createElement('div');
    configDiv.style = 'display: none; margin: 12px 0 16px; text-align: left';
    configDiv.innerHTML = `
      <div style="margin-bottom: 2px">转发词组（以分号 ";" 间隔，最多3个）：</div>
      <div style="display: flex;">
        <input class="awsl-config-input W_input" style="flex: 1;" />
        <a class="awsl-config-save W_btn_b" href="javascript:void(0)" style="margin-top: 2px; margin-left: 8px;">
          保存
        </a>
      </div>
    `;
    buttonBar.append(configDiv);

    const configInput = configDiv.querySelector('.awsl-config-input');
    const configSave = configDiv.querySelector('.awsl-config-save');
    configSave.addEventListener('click', async () => {
      await GM.setValue('words', configInput.value);
      await recreateButtons(buttonBar, textarea, submit);
      configDiv.style.display = 'none';
    })

    const configBtn = document.createElement('a');
    configBtn.className = 'S_txt1';
    configBtn.innerHTML = `
      <span class="W_autocut" style="width: auto;">配置转发</span>
      <i class="W_ficon ficon_set S_ficon_dis" style="margin: 0 0 0 2px; vertical-align: 4px;">*</i>
    `;
    configBtn.href = 'javascript:void(0)';
    configBtn.addEventListener('click', async () => {
      configInput.value = await GM.getValue('words', DEFAULT_WORDS);
      configDiv.style.display = configDiv.style.display == 'none' ? 'block' : 'none';
      configInput.focus();
    });
    limitsBar.append(configBtn);

    await recreateButtons(buttonBar, textarea, submit);
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
