import Isolate from './isolate';

(async function main() {
  let iso = new Isolate();

  const modules = [];
  modules.push(
    {id: 'react', path: 'react/umd/react.development.js', version: '16.6.1-canary-4a1072194', deps: null || []},
    {id: 'react-dom', path: 'react-dom/umd/react-dom.development.js', deps: ['react']},
    {id: 'index', path: '../dist/entry.js', deps: ['react', 'react-dom']}
  );

  await iso.loadModules(modules);
})();
