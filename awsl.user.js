// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      2.4.0
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
/* harmony import */ var _utils_kv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _utils_weibo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);



const DEFAULT_WORDS = '草;awsl';
let words = [];
(0,_utils_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS).then(v => {
    words = v.split(';').filter(t => !!t);
});
(0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.observe)(document.body, function fastForward() {
    const composers = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(document, '.Composer_mar1_ujs0j');
    for (const composer of composers) {
        const ctx = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$H)(composer.parentElement, {
            textarea: '.Form_input_3JT2Q',
            submit: '.Composer_btn_2XFOD',
            composer: '.Composer_mar1_ujs0j',
        });
        if (!ctx)
            continue;
        const visibleLimits = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$)(ctx.composer, '.Visible_limits_11OKi');
        const isForward = !!visibleLimits;
        if (isForward) {
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.bind)(ctx.composer, 'awsl-fastforward', '1', () => {
                setupButtons(ctx);
                setupMenus(ctx, visibleLimits);
            });
        }
        else {
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(ctx.composer, { 'awsl-fastforward': null });
            destroyButtons(ctx);
            destroyMenus(ctx);
        }
    }
});
function setupButtons(ctx) {
    const buttons = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(ctx.composer, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
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
        const button = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(buttons, () => (0,_utils_weibo__WEBPACK_IMPORTED_MODULE_2__.createButton)(word));
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(button, 'click', () => {
            ctx.textarea.value = word + ctx.textarea.value;
            ctx.textarea.dispatchEvent(new Event('input'));
            setTimeout(() => {
                ctx.submit.click();
            }, 200);
        });
    }
    return buttons;
}
function destroyButtons(ctx) {
    for (const el of (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(ctx.composer, '.awsl-fastforward')) {
        el.remove();
    }
}
function setupMenus(ctx, visibleLimits) {
    function insertMenu(text) {
        const menu = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span', [], {
            style: {
                'cursor': 'pointer',
                'user-select': 'none',
            },
            html: text,
        });
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.insertBefore)(visibleLimits.parentNode, visibleLimits, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
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
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(edit, 'click', () => toggleEdit(ctx, edit));
    }
    const custom = insertMenu('自定义');
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(custom, 'click', () => showCustom(ctx));
}
function destroyMenus(ctx) {
    for (const el of (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(ctx.composer, '.awsl-fastforward-menu')) {
        el.remove();
    }
}
function createModalWithButtons(title, content, cancelText, okText, onOk) {
    return (0,_utils_weibo__WEBPACK_IMPORTED_MODULE_2__.createModal)(title, (modal) => [
        () => content(modal),
        () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
            'wbpro-layer-btn',
            'woo-box-flex',
            'woo-box-justifyCenter',
        ], {}, [
            () => {
                const close = (0,_utils_weibo__WEBPACK_IMPORTED_MODULE_2__.createButton)(cancelText, 'default', ['wbpro-layer-btn-item']);
                (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(close, 'click', () => modal.remove());
                return close;
            },
            () => {
                const save = (0,_utils_weibo__WEBPACK_IMPORTED_MODULE_2__.createButton)(okText, 'primary', ['wbpro-layer-btn-item']);
                (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(save, 'click', () => {
                    onOk(modal);
                    modal.remove();
                });
                return save;
            },
        ]),
    ]);
}
function showCustom(ctx) {
    const container = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
        'woo-box-flex',
        'woo-box-wrap',
    ], {
        style: {
            'padding': '20px 20px 0',
            'gap': '8px',
        },
    });
    function createIconBtn(title, icon) {
        return (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('i', ['woo-font', `woo-font--${icon}`], {
            style: {
                'color': 'var(--w-fonticon)',
                'cursor': 'pointer',
                'margin': '0 8px',
            },
            attrs: { title },
        });
    }
    function createItemWrap() {
        return (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
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
            const wrap = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(container, () => createItemWrap());
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span', [], {
                style: {
                    'padding': '4px 8px',
                },
                html: word,
            }));
            const del = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => createIconBtn('删除', 'cross'));
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(del, 'click', () => {
                currentWords = currentWords.filter(t => t != word);
                fillWords();
            });
        }
        {
            const wrap = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(container, () => createItemWrap());
            const input = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('input', [], {
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
            const add = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => createIconBtn('添加', 'check'));
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(add, 'click', () => {
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
        await (0,_utils_kv__WEBPACK_IMPORTED_MODULE_0__.setValue)('words', words.join(';'));
        destroyButtons(ctx);
        setupButtons(ctx);
    });
}
function toggleEdit(ctx, editBtn) {
    const container = ctx.textarea.parentElement;
    const isEditing = ctx.textarea.style.display == 'none';
    if (isEditing) {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$)(container, '.awsl-editing')?.remove();
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.textarea, { 'display': '' });
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
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.style)(editBtn, { 'color': '' });
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.html)(editBtn, '编辑');
    }
    else {
        const [first, ...others] = escapeLinks(ctx.textarea.value).split('//').map(unescapeLinks);
        if (others.length == 0) {
            ctx.textarea.focus();
            return;
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.style)(ctx.textarea, { 'display': 'none' });
        container.classList.add('focus');
        const editor = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(container, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [
            'awsl-editing',
            'woo-box-flex',
            'woo-box-column',
        ], {
            style: {
                'gap': '2px',
            },
        }));
        const items = [];
        function updateTextarea() {
            const values = items
                .filter(item => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.attr)(item, 'data-awsl-removed') != 'yes')
                .map(item => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.attr)(item, 'data-awsl-text'));
            ctx.textarea.value = [first, ...values].join('//');
            ctx.textarea.dispatchEvent(new Event('input'));
        }
        for (const item of others) {
            const [_match, _prefix, name, text] = item.match(/^(([^\:]+)\:)?(.*)$/) || [];
            const wrap = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(editor, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('label', [
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
            const checkbox = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('input', [], {
                style: {
                    'width': 'auto',
                    'margin': '6px 0',
                },
                attrs: {
                    'type': 'checkbox',
                    'checked': 'yes',
                },
            }));
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(checkbox, 'change', () => {
                (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(wrap, { 'data-awsl-removed': checkbox.checked ? 'no' : 'yes' });
                updateTextarea();
            });
            const nameHtml = name
                ? `<span style="color: var(--w-alink)">${name}</span>: `
                : '';
            const textHtml = text
                ? `<span style="color: var(--w-main)">${text}</span>`
                : `<span style="color: var(--w-sub)">(空)</span>`;
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span', [], { html: `${nameHtml}${textHtml}` }));
        }
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.style)(editBtn, { 'color': 'var(--w-brand)' });
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.html)(editBtn, '完成');
    }
}
function escapeLinks(value) {
    return value.replace(/(http|https)\:\/\//g, '$1:$$$$');
}
function unescapeLinks(value) {
    return value.replace(/(http|https)\:\$\$/g, '$1://');
}


/***/ }),
/* 2 */
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
/* 3 */
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
/* harmony export */   "$OR": () => (/* binding */ $OR),
/* harmony export */   "attrs": () => (/* binding */ attrs),
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "observe": () => (/* binding */ observe),
/* harmony export */   "classNames": () => (/* binding */ classNames),
/* harmony export */   "bind": () => (/* binding */ bind)
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
function create(tag, classes = [], config = {}, children = []) {
    const element = document.createElement(tag);
    if (classes)
        attrs(element, { 'class': classNames(classes) });
    if (config.attrs)
        attrs(element, config.attrs);
    if (config.style)
        style(element, config.style);
    if (config.html)
        html(element, config.html);
    for (const creator of children) {
        append(element, creator);
    }
    return element;
}
function insertBefore(parent, child, creator) {
    const element = creator(parent);
    parent.insertBefore(element, child);
    return element;
}
function append(parent, creator) {
    const element = creator(parent);
    parent.append(element);
    return element;
}
function $OR(parent, selector, creator) {
    const element = $(parent, selector);
    if (element)
        return element;
    return append(parent, creator);
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
function attr(element, name) {
    return element.getAttribute(name);
}
function html(element, html) {
    element.innerHTML = html;
    return element;
}
function observe(element, callback) {
    const observer = new MutationObserver(callback);
    observer.observe(element, { childList: true, subtree: true });
    return observer;
}
function classNames(names) {
    return names.join(' ');
}
function bind(element, attrName, value, updater) {
    const cache = attr(element, attrName);
    if (cache != value) {
        attrs(element, { [attrName]: value });
        updater();
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createButton": () => (/* binding */ createButton),
/* harmony export */   "createModal": () => (/* binding */ createModal)
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

function createButton(text, type = 'default', classes = []) {
    return (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('button', [
        ...classes,
        'woo-button-main',
        'woo-button-flat',
        `woo-button-${type}`,
        'woo-button-m',
        'woo-button-round',
    ], {}, [
        () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('span', ['woo-button-wrap'], {}, [
            () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('span', ['woo-button-content'], { html: text }),
        ]),
    ]);
}
function createModal(title, content) {
    const app = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.$)(document.body, '#app');
    if (!app)
        return;
    (0,_dom__WEBPACK_IMPORTED_MODULE_0__.append)(app, () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', [
        'woo-box-flex',
        'woo-box-alignCenter',
        'woo-box-justifyCenter',
        'woo-modal-wrap',
    ], {}, [
        (modal) => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['woo-modal-main'], {}, [
            () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['wbpro-layer'], {}, [
                () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['woo-panel-main', 'woo-panel-bottom'], {}, [
                    () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['wbpro-layer-tit', 'woo-box-flex'], {}, [
                        () => (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['wbpro-layer-tit-text', 'woo-box-item-flex'], {
                            style: { 'align-self': 'center' },
                            html: title,
                        }),
                        () => {
                            const close = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', [
                                'wbpro-layer-tit-opt',
                                'woo-box-flex',
                                'woo-box-alignCenter',
                                'woo-box-justifyCenter',
                            ], {
                                html: `<i class="woo-font woo-font--cross"></i>`,
                            });
                            return (0,_dom__WEBPACK_IMPORTED_MODULE_0__.on)(close, 'click', () => modal.remove());
                        },
                    ]),
                ]),
                ...content(modal),
            ]),
        ]),
        (modal) => {
            const mask = (0,_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', ['woo-modal-mask']);
            return (0,_dom__WEBPACK_IMPORTED_MODULE_0__.on)(mask, 'click', () => modal.remove());
        },
    ]));
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function noRetweetMenu() {
    const popMenus = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$$)(document, '.toolbar_item_1ky_D .woo-pop-main:not([awsl="yes"])');
    for (const popMenu of popMenus) {
        const menu = popMenu;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(menu, { 'awsl': 'yes' });
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.style)(menu, { 'display': 'none' });
    }
    const popItems = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$$)(document, '.toolbar_item_1ky_D .woo-pop-main .woo-pop-item-main:not([awsl="yes"])');
    for (const popItem of popItems) {
        const item = popItem;
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(item, { 'awsl': 'yes' });
        if (item.innerText.trim() == '转发') {
            item.dispatchEvent(new Event('click'));
        }
    }
});


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function removeAds() {
    const ads = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$$)(document, '.TipsAd_wrap_3QB_0');
    for (const ad of ads) {
        ad.remove();
    }
});


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function userRemark() {
    const headNicks = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$$)(document, '.head_nick_1yix2');
    for (const headNick of headNicks) {
        const container = headNick;
        const context = container.__vue__?.$vnode.context;
        if (!context)
            continue;
        const headName = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$)(container, '.head_name_24eEB > span');
        if (!headName)
            continue;
        const infoBox = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$OR)(container, '.awsl-infobox', () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.create)('div', [
            'awsl-infobox',
        ], {
            style: {
                'color': '#999',
                'font-size': '80%',
                'font-weight': 'normal',
                'margin-left': '0.5em',
            },
        }));
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.bind)(container, 'awsl-infobox-id', context.id, () => {
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.html)(headName, context.userInfo.screen_name);
            const info = [];
            if (context.userInfo.remark) {
                info.push(`备注：${context.userInfo.remark}`);
            }
            if (context.userInfo.follow_me && context.userInfo.following) {
                info.push('互相关注');
            }
            if (context.region_name) {
                info.push(context.region_name);
            }
            (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.html)(infoBox, info.join('&nbsp;|&nbsp;'));
        });
    }
});


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
/* harmony import */ var _mods_fast_forward__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _mods_no_retweet_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _mods_remove_ads__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _mods_user_remark__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);





})();

/******/ })()
;