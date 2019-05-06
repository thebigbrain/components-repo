import EventEmitter from './event-emitter';

const emitter = new EventEmitter();

const ModuleStatus = {
  LOADED: 'module.loaded',
  INITIALIZED: 'module.initialized'
};

const DependencyStatus = {
  INITIALIZED: 'dep.initialized',
  DONE: 'dep.done'
};

class DependencyNode {
  id = null;
  deps = null;
  uninitialized = new Set();
  parents = new Set();

  status = null;
  depStatus = null;

  constructor(id, deps = []) {
    this.id = id;
    this.deps = deps;

    this.deps.forEach(id => this.uninitialized.add(id));

    this.depStatus = deps.length > 0 ? null : DependencyStatus.DONE;
  }

  includes(id) {
    return this.deps.include(id);
  }

  hasDeps() {
    return this.deps && this.deps.length > 0;
  }

  setInitialized(id) {
    if (this.uninitialized.has(id)) {
      this.uninitialized.delete(id);
    }

    if (this.uninitialized.size === 0) this.depStatus = DependencyStatus.DONE;
  }
}

export class DependencyGraph {
  __graph = new Map();

  buildFromModules(modules) {
    modules.forEach(mod => {
      let dep = new DependencyNode(mod.id, mod.deps);
      this.__graph.set(mod.id, dep);
    });

    this.__graph.forEach(dep => {
      dep.deps.forEach(id => {
        let d = this.__graph.get(id);
        d.parents.add(dep);
      });
    });
  }

  forEach(cb) {
    this.__graph.forEach(cb);
  }

  get(id) {
    return this.__graph.get(id);
  }

  getParents(id) {
    return this.get(id).parents;
  }
}

export class DependencyCache {
  __cache = new Map();
  depGraph = new DependencyGraph();

  handleDepsDone = (id) => {
    let dep = this.depGraph.get(id);
    if (dep.status === ModuleStatus.LOADED) {
      let mod = this.__cache.get(dep.id);
      mod.instantiate();
      dep.status = ModuleStatus.INITIALIZED;
    }

    if (dep.status === ModuleStatus.INITIALIZED) emitter.emit(DependencyStatus.INITIALIZED, dep.id);
  };

  handleDepInitialized = (id) => {
    this.depGraph.getParents(id).forEach(dep => {
      dep.setInitialized(id);
      if (dep.depStatus === DependencyStatus.DONE) {
        emitter.emit(DependencyStatus.DONE, dep.id);
      }
    });
  };

  handleModuleLoaded = (id) => {
    let dep = this.depGraph.get(id);

    if (!dep.hasDeps() || dep.depStatus === DependencyStatus.DONE) {
      let mod = this.__cache.get(id);
      mod.instantiate();
      dep.status = ModuleStatus.INITIALIZED;
      emitter.emit(DependencyStatus.INITIALIZED, dep.id);
    } else {
      dep.status = ModuleStatus.LOADED;
    }
  };

  init(modules) {
    this.depGraph.buildFromModules(modules);

    emitter.addListener(ModuleStatus.LOADED, this.handleModuleLoaded);
    emitter.addListener(DependencyStatus.INITIALIZED, this.handleDepInitialized);
    emitter.addListener(DependencyStatus.DONE, this.handleDepsDone);
  }

  has(id) {
    return this.__cache.has(id);
  }

  get(id) {
    return this.__cache.get(id);
  }

  set(id, mod) {
    this.__cache.set(id, mod);
    emitter.emit(ModuleStatus.LOADED, id);
  }
}
