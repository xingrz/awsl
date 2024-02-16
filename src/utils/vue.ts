export interface VueHTMLElement<T> extends HTMLElement {
  __vue__?: IVue & T;
}

export interface IVue {
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
  $store: {
    state: {
      feed: {
        feedGroup: {
          left?: IFeedGroup[];
          custom?: IFeedGroup[];
        };
      };
    };
  };
  $Bus: {
    $emit: (type: string, ...args: unknown[]) => void;
  };
}

export interface IRoute {
  name: string;
  path?: string;
  query?: Record<string, string>;
  fullPath?: string;
}

export interface IApp {
  config?: {
    uid: number;
  }
}

export interface IFeedGroup {
  api: string;
  apipath: string;
  count: number;
  frequency: number;
  gid: string;
  icon: string;
  name: string;
  title: string;
  type: string;
  uid: string;
}

export interface INode<C> {
  $vnode: {
    context: C;
  };
}
