// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      0.4.0
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

  async function recreateButtonsV6(buttonBar, extraBar, textarea, submit) {
    for (const btn of buttonBar.querySelectorAll('.awsl-button')) {
      btn.remove();
    }
    extraBar.innerHTML = '';

    const buttons = [];
    const words = (await getValue('words', DEFAULT_WORDS)).split(';').filter(t => !!t);

    function createButton(word) {
      const button = document.createElement('a');
      button.className = 'awsl-button W_btn_b';
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
      return button;
    }

    for (const word of words.slice(0, MAX_WORDS)) {
      const button = createButton(word);
      button.style = 'vertical-align: top; margin-right: 8px; max-width: 50px; overflow: hidden; text-overflow: ellipsis;';
      buttonBar.insertBefore(button, submit);
    }
    for (const word of words.slice(MAX_WORDS)) {
      const button = createButton(word);
      extraBar.append(button);
    }
    if (words.length > MAX_WORDS) {
      extraBar.style.marginBottom = '16px';
    }
  }

  async function handleDocumentChangesV6() {
    const forwardLayer = document.querySelector('.layer_forward:not([awsl="yes"])');
    if (!forwardLayer) return;

    const textarea = forwardLayer.querySelector('.WB_publish textarea.W_input');
    const publishBar = forwardLayer.querySelector('.WB_publish .p_opt');
    const buttonBar = publishBar.querySelector('.btn.W_fr');
    const optionBar = publishBar.querySelector('.opt')
    const limitsBar = buttonBar.querySelector('.limits');
    const submit = buttonBar.querySelector('.W_btn_a[node-type="submit"]');
    if (!textarea || !publishBar || !buttonBar || !optionBar || !limitsBar || !submit) return;

    forwardLayer.setAttribute('awsl', 'yes');

    buttonBar.style.float = 'none';
    buttonBar.style.display = 'flex';
    buttonBar.style.justifyContent = 'flex-end';

    const extraBar = document.createElement('div');
    extraBar.style = 'display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px';
    publishBar.insertBefore(extraBar, optionBar);

    const configDiv = document.createElement('div');
    configDiv.style = 'display: none; margin-bottom: 16px; text-align: left';
    configDiv.innerHTML = `
      <div style="margin-bottom: 2px">转发词组（以分号 ";" 间隔）：</div>
      <div style="display: flex;">
        <input class="awsl-config-input W_input" style="flex: 1;" />
        <a class="awsl-config-save W_btn_b" href="javascript:void(0)" style="margin-top: 2px; margin-left: 8px;">
          保存
        </a>
      </div>
    `;
    publishBar.insertBefore(configDiv, optionBar);

    const configInput = configDiv.querySelector('.awsl-config-input');
    const configSave = configDiv.querySelector('.awsl-config-save');
    configSave.addEventListener('click', async () => {
      await setValue('words', configInput.value);
      await recreateButtonsV6(buttonBar, extraBar, textarea, submit);
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
      configInput.value = await getValue('words', DEFAULT_WORDS);
      configDiv.style.display = configDiv.style.display == 'none' ? 'block' : 'none';
      configInput.focus();
    });
    limitsBar.append(configBtn);

    await recreateButtonsV6(buttonBar, extraBar, textarea, submit);
  }

  const observer = new MutationObserver(() => {
    handleDocumentChangesV6();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const ENV_GM = (typeof GM != 'undefined');

  async function getValue(key, defaultValue) {
    if (ENV_GM) {
      return await GM.getValue(key, defaultValue);
    } else {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (value) => {
          resolve(value[key] ?? defaultValue);
        });
      });
    }
  }

  async function setValue(key, value) {
    if (ENV_GM) {
      await GM.setValue(key, value);
    } else {
      await new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, resolve);
      });
    }
  }

})();
