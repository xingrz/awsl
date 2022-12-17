export function $<T extends HTMLElement>(parent: ParentNode, selecor: string): T | null {
  return parent.querySelector(selecor);
}

export function $$(parent: ParentNode, selecor: string): NodeListOf<Element> {
  return parent.querySelectorAll(selecor);
}

export function $H<T = Record<string, HTMLElement>>(parent: ParentNode, selectors: Record<keyof T, string>): T | null {
  const elements: Record<string, HTMLElement> = {};
  for (const key in selectors) {
    const el = $<HTMLElement>(parent, selectors[key]);
    if (el == null) return null;
    elements[key] = el;
  }
  return elements as unknown as T;
}

export function on<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): HTMLElement {
  element.addEventListener(type, listener, false);
  return element;
}

export function style(element: HTMLElement, style: Record<string, string>): HTMLElement {
  for (const key in style) {
    element.style.setProperty(key, style[key]);
  }
  return element;
}

export function toggle(element: HTMLElement, property: string, on: string, off: string): HTMLElement {
  const is = element.style.getPropertyValue(property) == on;
  element.style.setProperty(property, is ? off : on);
  return element;
}

export type ICreator<T extends HTMLElement> = (parent: HTMLElement) => T;

export function create<T extends HTMLElement>(tag: string, classes: string[] = [], config: {
  attrs?: Record<string, string>;
  style?: Record<string, string>;
  html?: string;
} = {}, children: ICreator<HTMLElement>[] = []): T {
  const element = document.createElement(tag) as T;
  if (classes) attrs(element, { 'class': classNames(classes) });
  if (config.attrs) attrs(element, config.attrs);
  if (config.style) style(element, config.style);
  if (config.html) html(element, config.html);
  for (const creator of children) {
    append(element, creator);
  }
  return element;
}

export function insertBefore<T extends HTMLElement>(parent: ParentNode, child: Node, creator: ICreator<T>): T {
  const element = creator(parent as HTMLElement);
  parent.insertBefore(element, child);
  return element;
}

export function append<T extends HTMLElement>(parent: ParentNode, creator: ICreator<T>): T {
  const element = creator(parent as HTMLElement);
  parent.append(element);
  return element;
}

export function $OR<T extends HTMLElement>(parent: ParentNode, selector: string, creator: ICreator<T>): T {
  const element = $<T>(parent, selector);
  if (element) return element;
  return append(parent, creator);
}

export function attrs(element: HTMLElement, attrs: Record<string, string | null>): HTMLElement {
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  }
  return element;
}

export function attr(element: HTMLElement, name: string): string | null {
  return element.getAttribute(name);
}

export function html(element: HTMLElement, html: string): HTMLElement {
  element.innerHTML = html;
  return element;
}

export function observe(element: HTMLElement, callback: MutationCallback): MutationObserver {
  const observer = new MutationObserver(callback);
  observer.observe(element, { childList: true, subtree: true });
  return observer;
}

export function classNames(names: string[]): string {
  return names.join(' ');
}

export function bind(element: HTMLElement, attrName: string, value: string, updater: () => void) {
  const cache = attr(element, attrName);
  if (cache != value) {
    attrs(element, { [attrName]: value });
    updater();
  }
}
