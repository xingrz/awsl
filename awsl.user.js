// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      2.6.0
// @description  Auto AWSLing
// @author       XiNGRZ <hi@xingrz.me>
// @license      WTFPL
// @match        https://*.weibo.com/*
// @grant        GM.getValue
// @grant        GM.setValue
// @updateURL    https://raw.githubusercontent.com/xingrz/awsl/master/awsl.meta.js
// @downloadURL  https://raw.githubusercontent.com/xingrz/awsl/master/awsl.user.js
// @homepageURL  https://github.com/xingrz/awsl
// @supportURL   https://github.com/xingrz/awsl/issues
// ==/UserScript==
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
        element.style.setProperty(key, style[key] ?? null);
    }
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
    if (config.events) {
        for (const key in config.events) {
            const name = key;
            const listener = config.events[name];
            on(element, name, listener);
        }
    }
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

const modules = new Map();
function registerModule(module) {
    modules.set(module.id, { module });
    console.log('[AWSL] Registered module:', module.id);
}
async function isModuleEnabled(module) {
    return getValue(`moduleEnabled:${module.id}`, module.defaultEnabled);
}
async function getModules() {
    return Promise.all(Array.from(modules.values()).map(async (record) => ({
        module: record.module,
        enabled: await isModuleEnabled(record.module),
    })));
}
async function loadModules() {
    for (const record of modules.values()) {
        if (await isModuleEnabled(record.module)) {
            record.observer = observe(document.body, record.module.init);
            console.log('[AWSL] Loaded module:', record.module.id);
        }
        else {
            console.log('[AWSL] Skipped module:', record.module.id);
        }
    }
}
async function enableModule(id) {
    const record = modules.get(id);
    if (record && !record.observer) {
        record.observer = observe(document.body, record.module.init);
        await setValue(`moduleEnabled:${id}`, true);
        console.log('[AWSL] Enabled module:', id);
    }
}
async function disableModule(id) {
    const record = modules.get(id);
    if (record && record.observer) {
        record.observer.disconnect();
        delete record.observer;
        record.module.cleanup?.();
        await setValue(`moduleEnabled:${id}`, false);
        console.log('[AWSL] Disabled module:', id);
    }
}

const prefersColorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
registerModule({
    id: 'auto_dark_mode',
    name: '跟随系统自动切换深色模式',
    defaultEnabled: true,
    init() {
        if (prefersColorSchemeQuery) {
            applyPreferredDarkMode(prefersColorSchemeQuery.matches);
            prefersColorSchemeQuery.addEventListener('change', handlePrefersColorSchemeChange);
        }
    },
    cleanup() {
        if (prefersColorSchemeQuery) {
            prefersColorSchemeQuery.removeEventListener('change', handlePrefersColorSchemeChange);
        }
    },
});
function handlePrefersColorSchemeChange(e) {
    applyPreferredDarkMode(e.matches);
}
function applyPreferredDarkMode(preferred) {
    const themeButton = $(document.body, '.Dark_box_2i4rW button');
    const currentMode = attr(document.documentElement, 'data-theme');
    if (themeButton && (preferred != (currentMode === 'dark'))) {
        themeButton.click();
    }
}

registerModule({
    id: 'expand_pics',
    name: '自动展开超过9张的图片',
    defaultEnabled: true,
    init() {
        const containers = $$(document, '.picture_inlineNum3_3P7k1:not([awsl-picbox="yes"])');
        for (const container of containers) {
            attrs(container, { 'awsl-picbox': 'yes' });
            const vue = container.__vue__;
            const context = vue?.$vnode.context;
            if (!context) {
                continue;
            }
            const mask = $(container, '.picture_mask_20G3v');
            if (mask) {
                on(mask, 'mouseenter', () => {
                    style(mask, { 'display': 'none' });
                    expand(container, context);
                    window.dispatchEvent(new Event('resize')); // Force page relayout
                });
                on(container, 'mouseleave', () => {
                    style(mask, { 'display': '' });
                    for (const item of $$(container, '.awsl-picbox-item')) {
                        item.remove();
                    }
                    window.dispatchEvent(new Event('resize')); // Force page relayout
                });
            }
        }
    },
});
function expand(container, context) {
    const pics = context.pics.slice(9);
    for (const [idx, pic] of pics.entries()) {
        const inlineBlock = append(container, () => create('div', [
            'awsl-picbox-item',
            'woo-box-item-inlineBlock',
            'picture_item_3zpCn',
            'picture_cursor_h5pJF',
        ], {
            style: {
                'padding-left': '0.25rem',
                'padding-top': '0.25rem',
                'flex-grow': '0',
            },
        }));
        const square = append(inlineBlock, () => create('div', [
            'woo-picture-main',
            'woo-picture-square',
            'woo-picture-hover',
            'picture_pic_eLDxR',
        ]));
        const img = create('img', ['picture_focusImg_1z5In'], {
            attrs: { 'src': pic.url },
            events: {
                click: (e) => context.$emit('picture-tap', {
                    index: 9 + idx,
                    pics: context.pics,
                    content: context.$attrs.content,
                }, e, e.target),
            },
        });
        // TODO
        // if (pic.focus_point) {
        //   if (pic.focus_point.width > pic.focus_point.height) {
        //   } else if (pic.focus_point.width < pic.focus_point.height) {
        //   }
        // }
        append(square, () => create('div', ['woo-picture-hoverMask']));
        append(square, () => create('div', ['woo-picture-slot'], {}, [() => img]));
    }
}

registerModule({
    id: 'expand_replies',
    name: '展开评论区回复浮层',
    defaultEnabled: true,
    init() {
        const modals = $$(document, '.ReplyModal_scroll3_2kADQ:not([awsl-expand-replies="yes"])');
        for (const modal of modals) {
            attrs(modal, { 'awsl-expand-replies': 'yes' });
            style(modal, {
                'height': 'auto',
                'max-height': 'calc(100vh - 132px)',
            });
        }
    },
});

function createButton(text, type = 'default', classes = []) {
    return create('button', [
        ...classes,
        'woo-button-main',
        'woo-button-flat',
        `woo-button-${type}`,
        'woo-button-m',
        'woo-button-round',
    ], {}, [
        () => create('span', ['woo-button-wrap'], {}, [
            () => create('span', ['woo-button-content'], { html: text }),
        ]),
    ]);
}
function createModal(title, content) {
    const app = $(document.body, '#app');
    if (!app)
        return;
    append(app, () => create('div', [
        'woo-box-flex',
        'woo-box-alignCenter',
        'woo-box-justifyCenter',
        'woo-modal-wrap',
    ], {}, [
        (modal) => create('div', ['woo-modal-main'], {}, [
            () => create('div', ['wbpro-layer'], {}, [
                () => create('div', ['woo-panel-main', 'woo-panel-bottom'], {}, [
                    () => create('div', ['wbpro-layer-tit', 'woo-box-flex'], {}, [
                        () => create('div', ['wbpro-layer-tit-text', 'woo-box-item-flex'], {
                            style: { 'align-self': 'center' },
                            html: title,
                        }),
                        () => {
                            const close = create('div', [
                                'wbpro-layer-tit-opt',
                                'woo-box-flex',
                                'woo-box-alignCenter',
                                'woo-box-justifyCenter',
                            ], {
                                html: `<i class="woo-font woo-font--cross"></i>`,
                            });
                            return on(close, 'click', () => modal.remove());
                        },
                    ]),
                ]),
                ...content(modal),
            ]),
        ]),
        (modal) => {
            const mask = create('div', ['woo-modal-mask']);
            return on(mask, 'click', () => modal.remove());
        },
    ]));
}

const DEFAULT_WORDS = '草;awsl';
let words = [];
getValue('words', DEFAULT_WORDS).then(v => {
    words = v.split(';').filter(t => !!t);
});
registerModule({
    id: 'fast_forward',
    name: '一键转发短语',
    defaultEnabled: true,
    init() {
        const composers = $$(document, '.Composer_mar1_ujs0j');
        for (const composer of composers) {
            const ctx = $H(composer.parentElement, {
                textarea: '.Form_input_3JT2Q',
                submit: '.Composer_btn_2XFOD',
                composer: '.Composer_mar1_ujs0j',
            });
            if (!ctx)
                continue;
            const visibleLimits = $(ctx.composer, '.Visible_limits_11OKi');
            const isForward = !!visibleLimits;
            if (isForward) {
                bind(ctx.composer, 'awsl-fastforward', '1', () => {
                    setupButtons(ctx);
                    setupMenus(ctx, visibleLimits);
                });
            }
            else {
                attrs(ctx.composer, { 'awsl-fastforward': null });
                destroyButtons(ctx);
                destroyMenus(ctx);
            }
        }
    },
});
function setupButtons(ctx) {
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
                const word = attr(e.target, 'data-awsl-word');
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
function destroyButtons(ctx) {
    for (const el of $$(ctx.composer, '.awsl-fastforward')) {
        el.remove();
    }
}
function setupMenus(ctx, visibleLimits) {
    function insertMenu(text) {
        const menu = create('span', [], {
            style: {
                'cursor': 'pointer',
                'user-select': 'none',
            },
            html: text,
        });
        insertBefore(visibleLimits.parentNode, visibleLimits, () => create('div', [
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
function destroyMenus(ctx) {
    for (const el of $$(ctx.composer, '.awsl-fastforward-menu')) {
        el.remove();
    }
}
function createModalWithButtons(title, content, cancelText, okText, onOk) {
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
function showCustom(ctx) {
    const container = create('div', [
        'woo-box-flex',
        'woo-box-wrap',
    ], {
        style: {
            'padding': '20px 20px 0',
            'gap': '8px',
        },
    });
    function createIconBtn(title, icon) {
        return create('i', ['woo-font', `woo-font--${icon}`], {
            style: {
                'color': 'var(--w-fonticon)',
                'cursor': 'pointer',
                'margin': '0 8px',
            },
            attrs: { title },
        });
    }
    function createItemWrap() {
        return create('div', [
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
    const currentWords = [...words];
    const add = append(container, () => {
        const wrap = createItemWrap();
        const input = append(wrap, () => create('input', [], {
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
        const btn = append(wrap, () => createIconBtn('添加', 'check'));
        on(btn, 'click', () => {
            const value = input.value.trim();
            if (value) {
                currentWords.push(value);
                input.value = '';
                fillWords();
            }
        });
        return wrap;
    });
    on(container, 'click', (e) => {
        if (e.target.matches('[data-awsl-word-index]')) {
            e.stopPropagation();
            const index = Number(attr(e.target, 'data-awsl-word-index'));
            currentWords.splice(index, 1);
            fillWords();
        }
    });
    function fillWords() {
        for (const el of $$(container, '[data-awsl-word]')) {
            el.remove();
        }
        for (const [index, word] of currentWords.entries()) {
            const wrap = insertBefore(container, add, () => createItemWrap());
            attrs(wrap, { 'data-awsl-word': word });
            append(wrap, () => create('span', [], {
                style: {
                    'padding': '4px 8px',
                },
                html: word,
            }));
            const del = append(wrap, () => createIconBtn('删除', 'cross'));
            attrs(del, { 'data-awsl-word-index': String(index) });
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
function toggleEdit(ctx, editBtn) {
    const container = ctx.textarea.parentElement;
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
    }
    else {
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
        const items = [];
        function updateTextarea() {
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
                        attrs(wrap, { 'data-awsl-removed': e.target.checked ? 'no' : 'yes' });
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
function escapeLinks(value) {
    return value.replace(/(http|https):\/\//g, '$1:$$$$');
}
function unescapeLinks(value) {
    return value.replace(/(http|https):\$\$/g, '$1://');
}

registerModule({
    id: 'logo_click',
    name: '点击 LOGO 进入「最新微博」',
    defaultEnabled: true,
    init() {
        const app = $(document, '#app:not([awsl-logoclick="yes"])');
        if (!app)
            return;
        attrs(app, { 'awsl-logoclick': 'yes' });
        const vue = app.__vue__;
        if (!vue)
            return;
        const uid = vue.config?.uid;
        if (!uid)
            return;
        const oldLogo = $(app, '.Nav_logoWrap_2fPbO');
        if (!oldLogo)
            return;
        const oldLogoHTML = oldLogo.outerHTML;
        oldLogo.outerHTML = oldLogoHTML; // Recreate logo element to remove existing event listeners
        const newLogo = $(app, '.Nav_logoWrap_2fPbO');
        attrs(newLogo, {
            'href': `/mygroups?gid=11000${uid}`,
        });
        on(newLogo, 'click', (e) => {
            e.preventDefault();
            vue.$router.push({
                name: 'mygroups',
                query: { gid: `11000${uid}` },
            });
            // Ensure timeline is reloaded
            if (vue.$store.state.feed.feedGroup.left) {
                const curIndex = 1;
                const navItem = vue.$store.state.feed.feedGroup.left[curIndex];
                vue.$Bus.$emit('handleHomeNav', navItem, curIndex, 'left');
            }
        });
    }
});

observe(document.body, function removeAds() {
    const ads = $$(document, '.TipsAd_wrap_3QB_0');
    for (const ad of ads) {
        ad.remove();
    }
});

observe(document.body, function removePromotion() {
    const feed = $(document, '.Home_feed_3o7ry:not([awsl-remove-promotion="yes"])');
    if (!feed || !feed.__vue__)
        return;
    attrs(feed, { 'awsl-remove-promotion': 'yes' });
    const vue = feed.__vue__;
    vue.$watch('data', (data) => {
        const hasPromotion = data.find((item) => item.promotion);
        if (hasPromotion) {
            vue.$set(vue, 'data', data.filter((item) => !item.promotion));
        }
    });
});

observe(document.body, function settings() {
    const nav = $(document, '.Nav_popcon__F1hb:not([awsl="yes"])');
    if (!nav)
        return;
    attrs(nav, { 'awsl': 'yes' });
    for (const item of nav.children) {
        if (!$(item, '[*|href="#woo_svg_nav_configFlat"]'))
            continue;
        const navItem = item;
        if (!navItem.__vue__)
            return;
        const vue = navItem.__vue__;
        const { configItems } = vue.$options.propsData;
        configItems.splice(-1, 0, { name: 'AWSL 设置', type: 'awsl' });
        vue.$on('config-item-tap', (idx) => {
            const item = configItems[idx];
            if (item?.type == 'awsl') {
                showSetings();
            }
        });
    }
});
async function showSetings() {
    const modules = await getModules();
    const toggles = {};
    createModal('AWSL 设置', (modal) => [
        () => create('div', [], {
            style: {
                'padding': '16px',
            },
        }, modules.map(({ module, enabled }) => () => {
            const toggle = create('input', [], {
                attrs: {
                    type: 'checkbox',
                    checked: enabled ? 'checked' : null,
                },
                style: {
                    'margin-right': '8px',
                },
            });
            toggles[module.id] = toggle;
            return create('div', [], {}, [
                () => create('label', ['woo-box-flex', 'woo-box-alignCenter'], {
                    style: {
                        'cursor': 'pointer',
                        'user-select': 'none',
                        'margin-bottom': '8px',
                    },
                }, [
                    () => toggle,
                    () => create('span', [], { html: module.name }),
                ]),
            ]);
        })),
        () => create('div', [
            'wbpro-layer-btn',
            'woo-box-flex',
            'woo-box-justifyCenter',
        ], {}, [
            () => {
                const close = createButton('取消', 'default', ['wbpro-layer-btn-item']);
                on(close, 'click', () => modal.remove());
                return close;
            },
            () => {
                const save = createButton('保存', 'primary', ['wbpro-layer-btn-item']);
                on(save, 'click', async () => {
                    for (const { module, enabled } of modules) {
                        const toggle = toggles[module.id];
                        if (!toggle)
                            continue;
                        if (enabled && !toggle.checked) {
                            await disableModule(module.id);
                        }
                        else if (!enabled && toggle.checked) {
                            await enableModule(module.id);
                        }
                    }
                    modal.remove();
                });
                return save;
            },
        ]),
    ]);
}

const SPLITTEER = '<span style="border-right: 1px solid var(--w-off-border); margin: 0 0.5em;"></span>';
registerModule({
    id: 'user_remark',
    name: '优化用户备注显示',
    defaultEnabled: true,
    init() {
        for (const container of $$(document, '.head_content_wrap_27749:not([awsl-infobox="yes"])')) {
            attrs(container, { 'awsl-infobox': 'yes' });
            const context = container.__vue__?.$vnode.context;
            if (!context)
                continue;
            const ctx = $H(container, {
                nick: '.head_nick_1yix2',
                nickName: '.head_name_24eEB > span',
                from: '.head-info_from_3FX0m > .woo-box-flex',
            });
            if (!ctx)
                continue;
            if (context.region_name) {
                const ip = $(ctx.from, '.head-info_ip_3ywCW');
                if (!ip) {
                    const ip = create('div', ['head-info_ip_3ywCW'], {
                        attrs: { title: context.region_name },
                        html: context.region_name,
                    });
                    const source = $(ctx.from, '.head-info_source_2zcEX');
                    if (source) {
                        insertBefore(ctx.from, source, () => ip);
                    }
                    else {
                        append(ctx.from, () => ip);
                    }
                }
            }
            const info = [];
            if (context.userInfo.remark) {
                html(ctx.nickName, context.userInfo.screen_name);
                info.push(`备注：${context.userInfo.remark}`);
            }
            if (context.userInfo.follow_me) {
                info.push(context.userInfo.following ? '互相关注' : '关注了我');
            }
            append(ctx.nick, () => create('div', [], {
                style: {
                    'color': 'var(--w-sub)',
                    'font-size': '80%',
                    'font-weight': 'normal',
                    'margin-left': '0.5em',
                },
                html: info.join(SPLITTEER),
            }));
        }
        for (const container of $$(document, '.Feed_retweet_JqZJb:not([awsl-infobox="yes"])')) {
            attrs(container, { 'awsl-infobox': 'yes' });
            const data = container.__vue__?.$vnode.context.transData;
            if (!data)
                continue;
            const ctx = $H(container, {
                head: '.detail_reText_30vF1 > div > .woo-box-flex',
                headNick: '.detail_nick_u-ffy',
                headVerify: '.detail_verify_1GOx9',
                from: '.head-info_from_3FX0m > .woo-box-flex',
            });
            if (!ctx)
                continue;
            if (data.region_name) {
                append(ctx.from, () => create('div', ['head-info_ip_3ywCW'], {
                    attrs: { title: data.region_name },
                    html: data.region_name,
                }));
            }
            if (data.source) {
                append(ctx.from, () => create('div', ['head-info_cut_1tPQI', 'head-info_source_2zcEX'], {
                    html: `来自 ${data.source}`,
                }));
            }
            if (!data.user.verified) {
                ctx.headVerify.remove();
            }
            const info = [];
            if (data.user.remark) {
                html(ctx.headNick, data.user.screen_name);
                info.push(`备注：${data.user.remark}`);
            }
            if (data.user.follow_me) {
                info.push(data.user.following ? '互相关注' : '关注了我');
            }
            append(ctx.head, () => create('div', [], {
                style: {
                    'color': 'var(--w-sub)',
                    'font-size': '80%',
                    'font-weight': 'normal',
                    'margin-left': '0.5em',
                },
                html: info.join(SPLITTEER),
            }));
        }
    },
});

loadModules();
