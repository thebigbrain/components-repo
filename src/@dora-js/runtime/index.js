import Isolate from './isolate';

(async function main() {
  let iso = new Isolate();

  const modules = window.__COMPONENTS_REPO_COMPONENTS_DEPENDENCY_GRAPH || [];

  await iso.loadModules(modules);
})();
