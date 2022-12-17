export interface VueHTMLElement<T> extends HTMLElement {
  __vue__?: IVue & T;
}

export interface IVue {
  _router?: {
    beforeEach(hook: (
      to: IRoute,
      from: IRoute,
      next: (next?: false | string | IRoute) => void
    ) => void): void;
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
