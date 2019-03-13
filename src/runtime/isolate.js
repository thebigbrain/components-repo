import JModule from './jmodule';
import Webrpc from './webrpc';

// function jsonpScript(src) {
//   const head = document.getElementsByTagName('head')[0];
//   const script = document.createElement('script');
//
//   script.charset = 'utf-8';
//   script.timeout = 120;
//
//   script.src = src;
//
//   let onScriptComplete = function (event) {
//     // avoid mem leaks in IE.
//     script.onerror = script.onload = null;
//     clearTimeout(timeout);
//   };
//
//   let timeout = setTimeout(function () {
//     onScriptComplete({type: 'timeout', target: script});
//   }, 120000);
//
//   script.onerror = script.onload = onScriptComplete;
//   head.appendChild(script);
// }

class Isolate {
  cache = {};

  async load(moduleId) {
    // Check if module is in cache
    if (this.cache[moduleId]) {
      return this.cache[moduleId];
    }

    // Create a new module (and put it into the cache)
    let module = await this.fetchModule(moduleId);
    module.instantiate();

    // Return the module
    return module;
  }

  async prefetch(imports = []) {
    for (let i of imports) {
      if (!this.cache[i]) {
        await this.load(i);
      }
    }
  }

  async fetchModule(moduleId) {
    let m = await Webrpc.invoke('jmodule', {id: moduleId});
    m.require = this.__require.bind(this);
    await this.prefetch(m['imports']);
    let module = new JModule(m);
    this.cache[moduleId] = module;
    return module;
  }

  __require(id) {
    let module = this.cache[id];
    console.log(module, id);
    return module.exports;
  }
}

export default Isolate;
