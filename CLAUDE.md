# AWSL - Weibo Tampermonkey Userscript

A Tampermonkey userscript that enhances Weibo (weibo.com) with quick-forward buttons, user remark display, auto dark mode, and more.

## Build & Dev

```bash
npm run dev    # watch mode with rollup
npm run build  # production build
```

Output goes to `dist/`. The user has auto-build running externally during development sessions — no need to start it.

## Architecture

### Module System (`src/module.ts`)

Each feature is a **module** registered via `registerModule({ id, name, setup })`. The `setup()` function registers lifecycle hooks:

- `onGlobal(handler)` — runs once after Vue app is found (for DOM observers, app-level setup)
- `onComponent(name, handler)` — runs on every Vue component mount matching `name` (via `app.mixin`)

Entry point (`src/index.ts`) watches for the Vue 3 app root (`[data-v-app]`), installs a mixin, then calls `dispatchInit()` which runs each module's `setup()` and fires global handlers.

Module enable/disable APIs (`getModules`, `enableModule`, `disableModule`) exist but are unused — the settings UI (`src/mods/settings.ts`) needs migration from Vue 2 APIs. All modules are always enabled for now.

### Modules (`src/mods/`)

| Module | Hook | Description |
|--------|------|-------------|
| `auto_dark_mode` | `onGlobal` | Follows system dark mode preference |
| `user_remark` | `onComponent('Feed')` | Shows remark/follow status on feeds |
| `logo_click` | `onGlobal` + `getApp()` | Logo click navigates to latest feed |
| `expand_pics` | `onComponent('FeedPicture')` | Expands 9+ picture grids on hover |
| `expand_replies` | `onGlobal` + `observe` | Auto-expands reply modal height |
| `fast_forward` | `onGlobal` + `observe` | Quick-forward buttons on forward composers |
| `settings` | *not imported* | Settings UI, pending Vue 3 migration |

### Utilities (`src/utils/`)

- `dom.ts` — DOM helpers: `$`, `$$`, `create`, `append`, `observe` (MutationObserver), `style`, `attrs`, etc.
- `kv.ts` — Key-value storage via `GM.getValue`/`GM.setValue`
- `weibo.ts` — Weibo-specific UI helpers: `createButton`, `createModal`
- `vue.ts` — `VueHTMLElement` type with `__vue_app__`

## Key Patterns

- **CSS selectors**: Weibo uses CSS modules with hash suffixes. Use `[class*="_partialName_"]` attribute selectors instead of exact class names.
- **Virtual scrolling**: Weibo uses DynamicScroller which recycles DOM elements. Never rely on attribute markers for "already processed" checks — check for the existence of injected elements instead (e.g., `$(el, '.awsl-fastforward')`).
- **Vue 3 internals**: Access component data via `instance.props`, emit events via `instance.emit()`, access router/store/bus via `app.config.globalProperties`.
- **Vuex store path**: User UID is at `$store.state.config.config.uid` (double nested `config`).

## Commit Style

Commits are authored by the repository owner. Claude is added as co-author:

```
Short description of change

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## Pending Work

- `settings.ts` needs Vue 3 migration — the old code uses `__vue__`, `$on`, `$options.propsData` which don't exist in Vue 3 Weibo. The navigation structure changed and the gear icon no longer has an injectable dropdown.
