// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      1.1.1
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
/* harmony export */   "$H": () => (/* binding */ $H),
/* harmony export */   "on": () => (/* binding */ on),
/* harmony export */   "style": () => (/* binding */ style),
/* harmony export */   "toggle": () => (/* binding */ toggle),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "insertBefore": () => (/* binding */ insertBefore),
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "attrs": () => (/* binding */ attrs),
/* harmony export */   "html": () => (/* binding */ html)
/* harmony export */ });
function $(parent, selecor) {
    return parent.querySelector(selecor);
}
function $$(parent, selecor) {
    return parent.querySelectorAll(selecor);
}
function $H(parent, selectors) {
    const elements = {};
    for (const key in selectors) {
        const el = $(parent, selectors[key]);
        if (el == null)
            return null;
        elements[key] = el;
    }
    return elements;
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
        const value = attrs[key];
        if (value == null) {
            element.removeAttribute(key);
        }
        else {
            element.setAttribute(key, value);
        }
    }
    return element;
}
function html(element, html) {
    element.innerHTML = html;
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
async function recreateButtonsV6(ctx, extraBar) {
    for (const btn of (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(ctx.btn, '.awsl-button')) {
        btn.remove();
    }
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(extraBar, '');
    const buttons = [];
    const words = (await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS)).split(';').filter(t => !!t);
    function createButton(word) {
        const button = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('a');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(button, word);
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(button, {
            'class': ['awsl-button', 'W_btn_b'].join(' '),
            'title': word,
            'href': 'javascript:void(0)',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(button, 'click', () => {
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
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(ctx.btn, ctx.submit, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(createButton(word), {
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
function createConfigV6(ctx, onSave) {
    const container = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(ctx.p_opt, ctx.opt, () => {
        const div = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(div, {
            'display': 'none',
            'margin-bottom': '16px',
            'text-align': 'left',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(div, `
      <div style="margin-bottom: 2px">转发词组（以分号 ";" 间隔）：</div>
      <div style="display: flex;">
        <input class="awsl-config-input W_input" style="flex: 1;" />
        <a class="awsl-config-save W_btn_b" href="javascript:void(0)" style="margin-top: 2px; margin-left: 8px;">
          保存
        </a>
      </div>
    `);
        return div;
    });
    const config = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$H)(container, {
        input: '.awsl-config-input',
        save: '.awsl-config-save',
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(config.save, 'click', async () => {
        await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.setValue)('words', config.input.value);
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(container, { 'display': 'none' });
        onSave();
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(ctx.opt, ctx.ipt, () => {
        const btn = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('a');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(btn, `
      <span class="W_autocut" style="width: auto;">配置转发</span>
      <i class="W_ficon ficon_set S_ficon_dis">*</i>
    `);
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(btn, {
            'class': 'S_txt1',
            'href': 'javascript:void(0)',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(btn, {
            'float': 'right',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(btn, 'click', async () => {
            config.input.value = await (0,_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS);
            (0,_dom__WEBPACK_IMPORTED_MODULE_1__.toggle)(container, 'display', 'none', 'block');
            config.input.focus();
        });
        return btn;
    });
}
function createTruncatorV6(ctx) {
    // 创建选择列表
    const container = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(ctx.p_input, ctx.textarea, () => {
        const div = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(div, {
            'display': 'none',
            'padding': '4px 4px 20px',
            'border': '1px solid #fa7d3c',
            'min-height': '54px',
        });
        return div;
    });
    function escapeLinks(value) {
        return value.replace(/(http|https)\:\/\//g, '$1:$$$$');
    }
    function unescapeLinks(value) {
        return value.replace(/(http|https)\:\$\$/g, '$1://');
    }
    function textToList() {
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(container, '');
        for (const raw of escapeLinks(ctx.textarea.value).split('//').slice(1)) {
            const full = unescapeLinks(raw);
            full.match(/^(([^\:]+)\:)?(.*)$/);
            const name = RegExp.$2 || '';
            const text = RegExp.$3 || '';
            (0,_dom__WEBPACK_IMPORTED_MODULE_1__.append)(container, () => {
                const label = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)((0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('label'), {
                    'display': 'flex',
                    'padding': '2px 4px',
                    'cursor': 'pointer',
                    'line-height': '1.5',
                });
                const input = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.append)(label, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('input'));
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(input, {
                    'margin-top': '2px',
                });
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(input, {
                    'class': 'W_checkbox',
                    'type': 'checkbox',
                    'value': full,
                    'checked': 'yes',
                });
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(input, 'change', () => listToText());
                const span = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.append)(label, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span'));
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(span, [
                    name ? `<span style="color: #eb7350">${name}</span>: ` : '',
                    (text && text.trim()) ? `<span>${text}</span>` : '<span class="S_txt2">(空)</span>',
                ].join(''));
                return label;
            });
        }
    }
    function listToText() {
        const values = [''];
        for (const el of (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(container, 'input[type="checkbox"]')) {
            const input = el;
            if (input.checked)
                values.push(input.value);
        }
        ctx.textarea.value = values.join('//');
        ctx.textarea.dispatchEvent(new Event('focus'));
    }
    // 在字数右侧加入按钮
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.num, {
        'right': '30px',
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.append)(ctx.p_input, () => {
        const edit = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('a');
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.html)(edit, `<i class="W_ficon">s</i>`);
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(edit, {
            'bottom': '6px',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(edit, {
            'class': ['tips', 'S_txt2'].join(' '),
            'href': 'javascript:void(0)',
        });
        (0,_dom__WEBPACK_IMPORTED_MODULE_1__.on)(edit, 'click', () => {
            if (container.style.display == 'none') {
                if (ctx.textarea.value.split('//').length > 2) {
                    textToList();
                    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.textarea, { 'display': 'none' });
                    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(container, { 'display': 'block' });
                }
            }
            else {
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(container, { 'display': 'none' });
                (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.textarea, { 'display': 'block' });
                ctx.textarea.setSelectionRange(0, 0);
                ctx.textarea.focus();
            }
        });
        return edit;
    });
}
async function handleDocumentChangesV6() {
    const forwardLayer = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$)(document, '.layer_forward:not([awsl="yes"])');
    if (!forwardLayer)
        return;
    const ctx = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.$H)(forwardLayer, {
        textarea: '[node-type="textEl"]',
        p_opt: '.p_opt',
        btn: '.p_opt .btn.W_fr',
        opt: '[node-type="widget"]',
        ico: '[node-type="widget"] .ico',
        ipt: '[node-type="cmtopts"]',
        submit: '[node-type="submit"]',
        p_input: '.p_input',
        num: '[node-type="num"]',
    });
    if (!ctx)
        return;
    // 标记为已改造
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(forwardLayer, { 'awsl': 'yes' });
    // 调整转发按钮和表情按钮的浮动关系
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.btn, {
        'float': 'none',
        'display': 'flex',
        'justify-content': 'flex-end',
        'margin-left': '60px',
    });
    (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.ico, {
        'float': 'left',
    });
    ctx.p_opt.insertBefore(ctx.ico, ctx.btn);
    // 新增一块区域用于超过3个的转发词
    const extraBar = (0,_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(ctx.p_opt, ctx.opt, () => (0,_dom__WEBPACK_IMPORTED_MODULE_1__.style)((0,_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div'), {
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
    // 创建转发截断控件
    createTruncatorV6(ctx);
}
const observer = new MutationObserver(() => {
    handleDocumentChangesV6();
});
observer.observe(document.body, { childList: true, subtree: true });

})();

/******/ })()
;