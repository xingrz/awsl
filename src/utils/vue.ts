import type { App } from 'vue';

export interface VueHTMLElement<T = unknown> extends HTMLElement {
  __vue_app__: App<T>;
}
