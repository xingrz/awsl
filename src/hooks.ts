import type { App, ComponentInternalInstance } from 'vue';

type InitHandler = (app: App) => void;
type ComponentHandler = (instance: ComponentInternalInstance, app: App) => void;

const initHandlers: InitHandler[] = [];
const mountedHandlers: Map<string, ComponentHandler[]> = new Map();
const updatedHandlers: Map<string, ComponentHandler[]> = new Map();

export function onInit(handler: InitHandler): void {
  initHandlers.push(handler);
}

export function onMounted(name: string, handler: ComponentHandler): void {
  const handlers = mountedHandlers.get(name) ?? [];
  handlers.push(handler);
  mountedHandlers.set(name, handlers);
}

export function onUpdated(name: string, handler: ComponentHandler): void {
  const handlers = updatedHandlers.get(name) ?? [];
  handlers.push(handler);
  updatedHandlers.set(name, handlers);
}

export function dispatchInit(app: App): void {
  for (const handler of initHandlers) {
    handler(app);
  }
}

export function dispatchMounted(instance: ComponentInternalInstance, app: App): void {
  const name = instance.type.name as string | undefined;
  if (!name) return;
  const handlers = mountedHandlers.get(name);
  if (handlers) {
    for (const handler of handlers) {
      handler(instance, app);
    }
  }
}

export function dispatchUpdated(instance: ComponentInternalInstance, app: App): void {
  const name = instance.type.name as string | undefined;
  if (!name) return;
  const handlers = updatedHandlers.get(name);
  if (handlers) {
    for (const handler of handlers) {
      handler(instance, app);
    }
  }
}
