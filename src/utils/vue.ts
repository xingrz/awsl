export interface VueHTMLElement<T = unknown> extends HTMLElement {
  __vue__?: IVueApp & T;
}

export interface IVue {
  $attrs: {};
  $emit: (type: string, ...args: unknown[]) => void;
}

export interface IVueApp extends IVue {
  $route: {
    fullPath: string;
    hash: string;
    name: string;
    path: string;
    query: Record<string, string>;
  };
  $router: {
    push: (...args: unknown[]) => void;
  };
  $store: {};
  $Bus: IVue;
}

export interface IStore<T> {
  $store: T;
}

export type IStoreState<T> = IStore<{ state: T }>;

export interface IVNode<T> {
  $vnode: T;
}

export type IVNodeContext<T> = IVNode<{ context: IVueApp & T }>;
