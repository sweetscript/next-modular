import { ModuleDefinition } from './types';

class ModuleRegistry {
  private modules: Map<string, ModuleDefinition> = new Map();

  register(module: ModuleDefinition) {
    if (this.modules.has(module.name)) {
      console.warn(`Module "${module.name}" is already registered. Overwriting...`);
    }
    this.modules.set(module.name, module);
  }

  getModule(name: string): ModuleDefinition | undefined {
    return this.modules.get(name);
  }

  getModuleConfig<TConfig = any>(name: string): TConfig | undefined {
    const module = this.modules.get(name);
    return module?.config as TConfig | undefined;
  }

  getAllModules(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  clear() {
    this.modules.clear();
  }
}

export const moduleRegistry = new ModuleRegistry();

