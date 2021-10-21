// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      1.0.0
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

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getValue": () => (/* binding */ getValue),
/* harmony export */   "setValue": () => (/* binding */ setValue)
/* harmony export */ });
const ENV_GM = (typeof GM != 'undefined');
function getValue(key, defaultValue) {
    if (ENV_GM) {
        return GM.getValue(key, defaultValue);
    }
    else {
        return new Promise((resolve) => {
            chrome.storage.local.get(key, (value) => {
                resolve(value[key] ?? defaultValue);
            });
        });
    }
}
function setValue(key, value) {
    if (ENV_GM) {
        return GM.setValue(key, value);
    }
    else {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, resolve);
        });
    }
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": () => (/* binding */ $),
/* harmony export */   "$$": () => (/* binding */ $$),
/* harmony export */   "on": () => (/* binding */ on),
/* harmony export */   "style": () => (/* binding */ style),
/* harmony export */   "toggle": () => (/* binding */ toggle),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "insertBefore": () => (/* binding */ insertBefore),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "attrs": () => (/* binding */ attrs)
/* harmony export */ });
function $(parent, selecor) {
    return parent.querySelector(selecor);
}
function $$(parent, selecor) {
    return parent.querySelectorAll(selecor);
}
function on(element, type, listener) {
    element.addEventListener(type, listener, false);
    return element;
}
function style(element, style) {
    for (const key in style) {
        element.style.setProperty(key, style[key]);
    }
    return element;
}
function toggle(element, property, on, off) {
    const is = element.style.getPropertyValue(property) == on;
    element.style.setProperty(property, is ? off : on);
    return element;
}
function create(tag) {
    return document.createElement(tag);
}
function insertBefore(parent, child, creator) {
    const element = creator();
    parent.insertBefore(element, child);
    return element;
}
function append(parent, creator) {
    const element = creator();
    parent.append(element);
    return element;
}
function attrs(element, attrs) {
    for (const key in attrs) {
        element.setAttribute(key, attrs[key]);
    }
    return element;
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _kv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


const DEFAULT_WORDS = '草;awsl';
const MAX_WORDS = 3;
async function recreateButtonsV6(buttonBar, extraBar, textarea, submit) {
    for (const btn of (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(buttonBar, '.awsl-button')) {
        btn.remove();
    }
    extraBar.innerHTML = '';
    const buttons = [];
    const words = (await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS)).split(';').filter(t => !!t);
    function createButton(word) {
        const button = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('a');
        button.innerHTML = word;
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(button, {
            'class': ['awsl-button', 'W_btn_b'].join(' '),
            'title': word,
            'href': 'javascript:void(0)',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(button, 'click', () => {
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
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(buttonBar, submit, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(createButton(word), {
            'vertical-align': 'top',
            'margin-right': '8px',
            'max-width': '50px',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
        }));
    }
    for (const word of words.slice(MAX_WORDS)) {
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.append)(extraBar, () => createButton(word));
    }
    if (words.length > MAX_WORDS) {
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(extraBar, { 'margin-bottom': '16px' });
    }
}
async function handleDocumentChangesV6() {
    const forwardLayer = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(document, '.layer_forward:not([awsl="yes"])');
    if (!forwardLayer)
        return;
    const textarea = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(forwardLayer, '.WB_publish textarea.W_input');
    const publishBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(forwardLayer, '.WB_publish .p_opt');
    if (!textarea || !publishBar)
        return;
    const buttonBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(publishBar, '.btn.W_fr');
    const optionBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(publishBar, '.opt');
    if (!buttonBar || !optionBar)
        return;
    const iconsBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(optionBar, '.ico');
    const iptBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(optionBar, '.ipt');
    if (!iconsBar || !iptBar)
        return;
    const limitsBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(buttonBar, '.limits');
    const submit = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(buttonBar, '.W_btn_a[node-type="submit"]');
    if (!limitsBar || !submit)
        return;
    forwardLayer.setAttribute('awsl', 'yes');
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(buttonBar, {
        'float': 'none',
        'display': 'flex',
        'justify-content': 'flex-end',
        'margin-left': '60px',
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(iconsBar, {
        'float': 'left',
    });
    publishBar.insertBefore(iconsBar, buttonBar);
    const extraBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(publishBar, optionBar, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)((0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div'), {
        'display': 'flex',
        'flex-wrap': 'wrap',
        'justify-content': 'flex-end',
        'gap': '8px',
    }));
    const configDiv = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(publishBar, optionBar, () => {
        const div = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(div, {
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
    const configInput = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(configDiv, '.awsl-config-input');
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)((0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(configDiv, '.awsl-config-save'), 'click', async () => {
        await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.setValue)('words', configInput.value);
        await recreateButtonsV6(buttonBar, extraBar, textarea, submit);
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(configDiv, { 'display': 'none' });
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(optionBar, iptBar, () => {
        const btn = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('a');
        btn.innerHTML = `
      <span class="W_autocut" style="width: auto;">配置转发</span>
      <i class="W_ficon ficon_set S_ficon_dis">*</i>
    `;
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(btn, {
            'class': 'S_txt1',
            'href': 'javascript:void(0)',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(btn, {
            'float': 'right',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(btn, 'click', async () => {
            configInput.value = await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS);
            (0,_dom__WEBPACK_IMPORTED_MODULE_1__.toggle)(configDiv, 'display', 'none', 'block');
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

})();

/******/ })()
;