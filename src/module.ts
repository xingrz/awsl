import { observe } from './utils/dom';
import { getValue, setValue } from './utils/kv';

export interface IModule {
  id: string;
  name: string;
  defaultEnabled?: boolean;
  init: MutationCallback;
  cleanup?: () => void;
}

const modules: Map<string, {
  module: IModule;
  observer?: MutationObserver;
}> = new Map();

export function registerModule(module: IModule): void {
  modules.set(module.id, { module });
  console.log('[AWSL] Registered module:', module.id);
}

export async function isModuleEnabled(module: IModule): Promise<boolean> {
  return getValue<boolean>(`moduleEnabled:${module.id}`, module.defaultEnabled);
}

export async function getModules(): Promise<{ module: IModule, enabled: boolean }[]> {
  return Promise.all(Array.from(modules.values()).map(async (record) => ({
    module: record.module,
    enabled: await isModuleEnabled(record.module),
  })));
}

export async function loadModules(): Promise<void> {
  for (const record of modules.values()) {
    if (await isModuleEnabled(record.module)) {
      record.observer = observe(document.body, record.module.init);
      console.log('[AWSL] Loaded module:', record.module.id);
    } else {
      console.log('[AWSL] Skipped module:', record.module.id);
    }
  }
}

export async function enableModule(id: string): Promise<void> {
  const record = modules.get(id);
  if (record && !record.observer) {
    record.observer = observe(document.body, record.module.init);
    await setValue(`moduleEnabled:${id}`, true);
  }
}

export async function disableModule(id: string): Promise<void> {
  const record = modules.get(id);
  if (record && record.observer) {
    record.observer.disconnect();
    record.module.cleanup?.();
    await setValue(`moduleEnabled:${id}`, false);
  }
}
