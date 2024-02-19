import type Vue from 'vue';
import type { VNode } from 'vue';
import type { Store } from 'vuex';
import 'vue-router';

export interface VueHTMLElement<T = unknown> extends HTMLElement {
  __vue__?: IVueApp & T;
}

export interface IVueApp extends Vue {
  $Bus: Vue;
}

export interface WithStore<K extends string, T> {
  $store: Store<Record<K, T>>;
}

export interface WithVNode<T> {
  $vnode: VNode & T;
}

export interface WithVNodeContext<T> {
  context: IVueApp & T;
}
