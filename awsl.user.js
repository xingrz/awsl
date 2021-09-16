// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      0.1.1
// @description  Auto AWSLing
// @author       XiNGRZ <hi@xingrz.me>
// @license      WTFPL
// @match        https://weibo.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/xingrz/awsl/master/awsl.user.js
// @homepageURL  https://github.com/xingrz/awsl
// @supportURL   https://github.com/xingrz/awsl/issues
// ==/UserScript==

'use strict';

(() => {

  function createButton(text, onclick) {
    const button = document.createElement('a');
    button.className = 'W_btn_b';
    button.style.verticalAlign = 'top';
    button.style.marginRight = '8px';
    button.innerHTML = text;
    button.href = 'javascript:void(0)';
    button.addEventListener('click', onclick);
    return button;
  }

  const observer = new MutationObserver(() => {
    const forwardLayer = document.querySelector('.layer_forward:not([awsl="yes"])');
    if (!forwardLayer) return;

    forwardLayer.setAttribute('awsl', 'yes');

    const textarea = forwardLayer.querySelector('textarea.W_input');
    const buttonBar = forwardLayer.querySelector('.btn.W_fr');
    const submit = forwardLayer.querySelector('.W_btn_a[node-type="submit"]');
    if (!textarea || !buttonBar || !submit) return;

    const buttons = [];
    function disableAllButtons() {
      buttons.forEach((btn) => btn.classList.add('W_btn_b_disable'));
    }

    buttons.push(createButton('草', () => {
      textarea.value = '草' + textarea.value;
      disableAllButtons();
      submit.click();
    }));

    buttons.push(createButton('awsl', () => {
      textarea.value = 'awsl' + textarea.value;
      disableAllButtons();
      submit.click();
    }));

    buttons.forEach((btn) => buttonBar.insertBefore(btn, submit));
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
