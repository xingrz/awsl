export interface IModule {
  id: string;
  name: string;
  defaultEnabled?: boolean;
  setup: () => void;
}

const modules: Map<string, {
  module: IModule;
}> = new Map();

export function registerModule(module: IModule): void {
  modules.set(module.id, { module });
  console.log('[AWSL] Registered module:', module.id);
}

export function isModuleEnabled(_module: IModule): boolean {
  return true; // enable all for now
}

export function getModules(): { module: IModule, enabled: boolean }[] {
  return Array.from(modules.values()).map((record) => ({
    module: record.module,
    enabled: isModuleEnabled(record.module),
  }));
}

export function loadModules(): void {
  for (const record of modules.values()) {
    if (isModuleEnabled(record.module)) {
      record.module.setup();
      console.log('[AWSL] Loaded module:', record.module.id);
    } else {
      console.log('[AWSL] Skipped module:', record.module.id);
    }
  }
}

export function enableModule(_id: string): void {
  // no-op for now
}

export function disableModule(_id: string): void {
  // no-op for now
}
