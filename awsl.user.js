// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      2.1.0
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


const DEFAULT_WORDS = '草;awsl';
(0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.observe)(document.body, async function fastForward() {
    const composers = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$$)(document, '.Composer_mar1_ujs0j:not([awsl="yes"])');
    if (!composers.length)
        return;
    const words = (await (0,_utils_kv__WEBPACK_IMPORTED_MODULE_0__.getValue)('words', DEFAULT_WORDS)).split(';').filter(t => !!t);
    for (const composer of composers) {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.attrs)(composer, { 'awsl': 'yes' });
        injectButtons(composer.parentElement, words);
    }
});
function injectButtons(container, words) {
    const ctx = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.$H)(container, {
        textarea: '.Form_input_3JT2Q',
        submit: '.Composer_btn_2XFOD',
        composer: '.Composer_mar1_ujs0j',
    });
    if (!ctx)
        return;
    const buttons = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(ctx.composer, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('div', [], {
        style: {
            'display': 'flex',
            'flex-wrap': 'wrap',
            'justify-content': 'flex-end',
            'gap': '4px 8px',
            'margin-top': '4px',
        },
    }));
    for (const word of words) {
        const button = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(buttons, () => createButton(word));
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.on)(button, 'click', () => {
            ctx.textarea.value = word + ctx.textarea.value;
            ctx.textarea.dispatchEvent(new Event('input'));
            setTimeout(() => {
                ctx.submit.click();
            }, 200);
        });
    }
}
function createButton(text) {
    const button = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('button', [
        'woo-button-main',
        'woo-button-flat',
        'woo-button-default',
        'woo-button-m',
        'woo-button-round',
    ]);
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(button, () => {
        const wrap = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span', ['woo-button-wrap']);
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.append)(wrap, () => (0,_utils_dom__WEBPACK_IMPORTED_MODULE_1__.create)('span', ['woo-button-content'], { html: text }));
        return wrap;
    });
    return button;
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
/* harmony export */   "attrs": () => (/* binding */ attrs),
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "html": () => (/* binding */ html),
/* harmony export */   "observe": () => (/* binding */ observe),
/* harmony export */   "classNames": () => (/* binding */ classNames)
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
function create(tag, classes = [], config) {
    const element = document.createElement(tag);
    if (classes)
        attrs(element, { 'class': classNames(classes) });
    if (config?.attrs)
        attrs(element, config.attrs);
    if (config?.style)
        style(element, config.style);
    if (config?.html)
        html(element, config.html);
    return element;
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


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function adjustRouter() {
    const app = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$)(document, '#app:not([awsl="yes"])');
    if (!app)
        return;
    const vue = app.__vue__;
    if (!vue)
        return;
    const uid = vue.config?.uid;
    if (!uid)
        return;
    const router = vue._router;
    if (!router)
        return;
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(app, { 'awsl': 'yes' });
    router.beforeEach((to, _from, next) => {
        if (to.name == 'home') {
            next({
                name: 'mygroups',
                query: {
                    gid: `11000${uid}`,
                },
            });
        }
        else {
            next();
        }
    });
});


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function adjustNavItems() {
    const navAll = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$)(document, '.Nav_inner_1QCVO a.ALink_none_1w6rm[href="/"]:not([awsl="yes"])');
    if (navAll) {
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.style)(navAll, { 'display': 'none' });
        (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(navAll, { 'awsl': 'yes' });
    }
    const ctx = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$H)(document, {
        app: '#app',
        logo: '.Nav_logoWrap_2fPbO[href="/"]',
        tabHome: '.woo-tab-nav a.Ctrls_alink_1L3hP[href="/"]',
    });
    if (!ctx)
        return;
    const uid = ctx.app.__vue__?.config?.uid;
    if (!uid)
        return;
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(ctx.logo, {
        'href': `/mygroups?gid=11000${uid}`,
    });
    (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.attrs)(ctx.tabHome, {
        'href': `/mygroups?gid=11000${uid}`,
    });
});


/***/ }),
/* 6 */
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
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);

(0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.observe)(document.body, function removeAds() {
    const ads = (0,_utils_dom__WEBPACK_IMPORTED_MODULE_0__.$$)(document, '.TipsAd_wrap_3QB_0');
    for (const ad of ads) {
        ad.remove();
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
/* harmony import */ var _mods_home_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _mods_nav_items__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _mods_no_retweet_menu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _mods_remove_ads__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7);






})();

/******/ })()
;