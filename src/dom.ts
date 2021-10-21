export function $<T extends HTMLElement>(parent: ParentNode, selecor: string): T | null {
  return parent.querySelector(selecor);
}

export function $$(parent: ParentNode, selecor: string): NodeListOf<Element> {
  return parent.querySelectorAll(selecor);
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

export function create(tag: string): HTMLElement {
  return document.createElement(tag);
}

export function insertBefore(parent: ParentNode, child: Node, creator: () => HTMLElement): HTMLElement {
  const element = creator();
  parent.insertBefore(element, child);
  return element;
}

export function append(parent: ParentNode, creator: () => HTMLElement): HTMLElement {
  const element = creator();
  parent.append(element);
  return element;
}

export function attrs(element: HTMLElement, attrs: Record<string, string>): HTMLElement {
  for (const key in attrs) {
    element.setAttribute(key, attrs[key]);
  }
  return element;
}