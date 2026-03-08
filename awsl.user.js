// ==UserScript==
// @name         AWSL
// @namespace    https://github.com/xingrz
// @version      2.8.2
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
const modules = new Map();
function registerModule(module) {
    modules.set(module.id, { module });
    console.log('[AWSL] Registered module:', module.id);
}
function isModuleEnabled(_module) {
    return true; // enable all for now
}
function loadModules() {
    for (const record of modules.values()) {
        if (isModuleEnabled(record.module)) {
            record.module.setup();
            console.log('[AWSL] Loaded module:', record.module.id);
        }
    }
}

const initHandlers = [];
const mountedHandlers = new Map();
const updatedHandlers = new Map();
function onInit(handler) {
    initHandlers.push(handler);
}
function onMounted(name, handler) {
    const handlers = mountedHandlers.get(name) ?? [];
    handlers.push(handler);
    mountedHandlers.set(name, handlers);
}
function onUpdated(name, handler) {
    const handlers = updatedHandlers.get(name) ?? [];
    handlers.push(handler);
    updatedHandlers.set(name, handlers);
}
function dispatchInit(app) {
    for (const handler of initHandlers) {
        handler(app);
    }
}
function dispatchMounted(instance, app) {
    const name = instance.type.name;
    if (!name)
        return;
    const handlers = mountedHandlers.get(name);
    if (handlers) {
        for (const handler of handlers) {
            handler(instance, app);
        }
    }
}
function dispatchUpdated(instance, app) {
    const name = instance.type.name;
    if (!name)
        return;
    const handlers = updatedHandlers.get(name);
    if (handlers) {
        for (const handler of handlers) {
            handler(instance, app);
        }
    }
}

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

registerModule({
    id: 'auto_dark_mode',
    name: '跟随系统自动切换深色模式',
    defaultEnabled: true,
    setup() {
        const prefersColorSchemeQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
        onInit(() => {
            if (prefersColorSchemeQuery) {
                applyPreferredDarkMode(prefersColorSchemeQuery.matches);
                prefersColorSchemeQuery.addEventListener('change', handlePrefersColorSchemeChange);
            }
        });
        function handlePrefersColorSchemeChange(e) {
            applyPreferredDarkMode(e.matches);
        }
        function applyPreferredDarkMode(preferred) {
            const themeButton = $(document.body, '._popcon_18dhr_163 ._box_1chqx_2 button[displaymode]');
            const currentMode = attr(document.documentElement, 'data-theme');
            if (themeButton && (preferred != (currentMode === 'dark'))) {
                themeButton.click();
            }
        }
    },
});

registerModule({
    id: 'expand_pics',
    name: '自动展开超过9张的图片',
    defaultEnabled: true,
    setup() {
        onMounted('FeedPicture', (instance) => {
            const el = instance.vnode.el;
            if (!el)
                return;
            const props = instance.props;
            if (props.pic_num <= 9)
                return;
            const mask = $(el, '[class*="_mask_"]');
            if (!mask)
                return;
            // The actual flex wrap container is the first child of the picture row
            const wrap = el.firstElementChild;
            if (!wrap)
                return;
            // Extract class names from existing items to match styling
            const refItem = $(wrap, '[class*="_item_"]');
            const refPic = $(wrap, '[class*="_pic_"]');
            const refImg = $(wrap, 'img');
            const itemClasses = refItem?.className.split(' ').filter(c => c) ?? [];
            const picClasses = refPic?.className.split(' ').filter(c => c) ?? [];
            const imgClasses = refImg?.className.split(' ').filter(c => c) ?? [];
            on(mask, 'mouseenter', () => {
                style(mask, { 'display': 'none' });
                expandPics(wrap, props.pics, instance, itemClasses, picClasses, imgClasses);
                window.dispatchEvent(new Event('resize'));
            });
            on(el, 'mouseleave', () => {
                style(mask, { 'display': '' });
                for (const item of $$(wrap, '.awsl-picbox-item')) {
                    item.remove();
                }
                window.dispatchEvent(new Event('resize'));
            });
        });
    },
});
function expandPics(wrap, pics, instance, itemClasses, picClasses, imgClasses) {
    const extraPics = pics.slice(9);
    for (const [idx, pic] of extraPics.entries()) {
        const inlineBlock = append(wrap, () => create('div', [
            'awsl-picbox-item',
            ...itemClasses,
        ], {
            style: {
                'padding-left': '0.25rem',
                'padding-top': '0.25rem',
            },
        }));
        const square = append(inlineBlock, () => create('div', picClasses));
        const img = create('img', imgClasses, {
            attrs: { 'src': pic.url },
            events: {
                click: (e) => {
                    instance.emit('pictureTap', {
                        index: 9 + idx,
                        pics,
                    }, e, e.target);
                },
            },
        });
        append(square, () => create('div', ['woo-picture-hoverMask']));
        append(square, () => create('div', ['woo-picture-slot'], {}, [() => img]));
    }
}

registerModule({
    id: 'expand_replies',
    name: '展开评论区回复浮层',
    defaultEnabled: true,
    setup() {
        const style = document.createElement('style');
        style.textContent = '[class*="_scroll3_"] { height: auto !important; max-height: calc(100vh - 200px) !important; }';
        document.head.appendChild(style);
    },
});

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
registerModule({
    id: 'fast_forward',
    name: '一键转发短语',
    defaultEnabled: true,
    setup() {
        getValue('words', DEFAULT_WORDS).then(v => {
            words = v.split(';').filter(t => !!t);
        });
        onUpdated('Composer', (instance) => {
            const composer = instance.vnode.el;
            if (!composer)
                return;
            const ctx = $H(composer, {
                textarea: 'textarea[class*="_input_"]',
                submit: 'button.woo-button-primary',
            });
            if (!ctx)
                return;
            const visibleLimits = $(composer, '[class*="_limits_"]');
            const alreadySetup = $(composer, '.awsl-fastforward');
            if (!visibleLimits) {
                destroyButtons({ ...ctx, composer });
                destroyMenus({ ...ctx, composer });
            }
            else if (!alreadySetup) {
                setupButtons({ ...ctx, composer });
                setupMenus({ ...ctx, composer }, visibleLimits);
            }
        });
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
    setup() {
        onInit((app) => {
            const { $router, $store, $Bus } = app.config.globalProperties;
            const uid = $store.state.config?.config?.uid;
            if (!uid)
                return;
            const logo = $(document, 'a[class*="_logoWrap"]');
            if (!logo)
                return;
            attrs(logo, { 'href': `/mygroups?gid=11000${uid}` });
            on(logo, 'click', (e) => {
                e.preventDefault();
                $router.push({
                    name: 'mygroups',
                    query: { gid: `11000${uid}` },
                });
                const left = $store.state.feed.feedGroup.left;
                if (left) {
                    const curIndex = 1;
                    const navItem = left[curIndex];
                    $Bus.$emit('handleHomeNav', navItem, curIndex, 'left');
                }
            });
        });
    },
});

const SPLITTER = '<span style="border-right: 1px solid var(--w-off-border); margin: 0 0.5em;"></span>';
registerModule({
    id: 'user_remark',
    name: '优化用户备注显示',
    defaultEnabled: true,
    setup() {
        // 信息流一级作者
        onMounted('Feed', (instance) => {
            const el = instance.vnode.el;
            if (!el)
                return;
            const data = instance.props.data;
            if (!data?.user)
                return;
            const ctx = $H(el, {
                nick: '[class*="_nick_"]',
                name: '[class*="_nick_"] > [class*="_name_"] > span',
            });
            if (!ctx || $(ctx.nick, '.awsl-remark'))
                return;
            if (data.user.remark) {
                html(ctx.name, data.user.screen_name);
            }
            buildRemark(ctx.nick, data.user);
        });
        // 转发内容的原作者
        onMounted('FeedContent', (instance) => {
            const el = instance.vnode.el;
            if (!el || !el.classList.contains('retweet'))
                return;
            const data = instance.props.data;
            if (!data?.user)
                return;
            const ctx = $H(el, {
                link: '.wbpro-feed-reText [usercard]',
                name: '.wbpro-feed-reText [usercard] > [class*="_nick_"]',
            });
            if (!ctx)
                return;
            const container = ctx.link.parentElement;
            const verify = $(container, '[class*="_verify_"]');
            if ($(container, '.awsl-remark'))
                return;
            if (!data.user.verified && verify) {
                verify.remove();
            }
            if (data.user.remark) {
                html(ctx.name, data.user.screen_name);
            }
            buildRemark(container, data.user);
        });
    },
});
function buildRemark(container, user) {
    const info = [];
    if (user.remark) {
        info.push(`备注：${user.remark}`);
    }
    if (user.follow_me) {
        info.push(user.following ? '互相关注' : '关注了我');
    }
    if (info.length > 0) {
        append(container, () => create('div', ['awsl-remark'], {
            style: {
                'color': 'var(--w-sub)',
                'font-size': '80%',
                'font-weight': 'normal',
                'margin-left': '0.5em',
            },
            html: info.join(SPLITTER),
        }));
    }
}

observe(document.body, (_, observer) => {
    const root = $(document, '[data-v-app]:not([awsl-root="yes"])');
    if (!root)
        return;
    attrs(root, { 'awsl-root': 'yes' });
    observer.disconnect();
    console.log('[AWSL] Vue app found, installing mixin');
    const vue = root.__vue_app__;
    vue.mixin({
        mounted() {
            const instance = this._;
            dispatchMounted(instance, vue);
        },
        updated() {
            const instance = this._;
            dispatchUpdated(instance, vue);
        },
    });
    dispatchInit(vue);
});
loadModules();
