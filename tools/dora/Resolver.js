const fs = require('fs');
const path = require('path');
const Parser = require('./Parser');
const Asset = require('./Asset');

const posix = path.posix;
const rootAsset = new Asset('/');

function isDora(name) {
  return name.startsWith('dora:');
}

function isBabelRuntimeHelpers(name) {
  return name.startsWith('@babel/runtime/helpers');
}

function resolveDora(name) {
  return {
    id: name,
    path: '',
    deps: null,
    version: null,
    asset: new Asset(name)
  };
}

function resolveBabelRuntimeHelpers(name) {
  return resolveDora(`dora:${name}`);
}

class Resolver {
  constructor(options) {
    this.options = options;

    this.tree = new Map();
    this.parser = new Parser();
  }

  resolve(name, parentAsset = rootAsset) {
    let resolved = isDora(name)
      ? resolveDora(name)
      : isBabelRuntimeHelpers(name)
        ? resolveBabelRuntimeHelpers(name)
        : this.resolveLocal(name, parentAsset);

    this.tree.set(name, resolved);

    if (resolved && resolved.deps) {
      resolved.deps.forEach((dep) => {
        this.resolve(dep, resolved.asset);
      });
    }

    return this.tree;
  }

  resolveLocal(name, parentAsset) {
    let src = path.join(this.options.root, 'src');
    if (name.startsWith('.')) {
      name = posix.normalize(posix.resolve(parentAsset.name, name));
    }
    let source = fs.readFileSync(path.join(src, name), 'utf-8');
    const asset = this.parser.getAsset(name, {source});
    asset.generate();
    return asset.toJSON();
  }
}

module.exports = Resolver;
