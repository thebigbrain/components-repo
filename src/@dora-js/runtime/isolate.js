import JModule from './jmodule';
import {DependencyCache} from './dep';
// import Webrpc from './webrpc';

const PlaceHolder = null;

class Isolate {
  depCache = new DependencyCache();
  __require = (moduleId) => {
    let module = this.depCache.get(moduleId);
    // console.log(module, moduleId);
    return module.exports;
  };

  async loadModules(modules = []) {
    this.depCache.init(modules);

    modules.forEach(async m => {
      await this.fetchModule(m);
    });
  }

  getModule(moduleId) {
    if (this.depCache.has(moduleId)) {
      return this.depCache.get(moduleId);
    }

    return PlaceHolder;
  }

  async fetchModule(m) {
    let res = await fetch(`http://localhost:4000/jmodule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(m)
    });
    let code = await res.text();
    let mod = new JModule({...m, code, require: this.__require});
    this.depCache.set(mod.id, mod);
    return mod;
  }
}

export default Isolate;
