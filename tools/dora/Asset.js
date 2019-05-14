const path = require('path');
// const babel = require('./babel');
// const dora = require('./dora');

const posix = path.posix;

class Asset {
  constructor(name, options = {}) {
    this.name = name;
    this.basename = posix.basename(name);
    this.deps = new Set();
    this.options = options;
  }

  generate() {
    this.transform();
    this.collectDeps();
  }

  transform() {
  }

  collectDeps() {
  }

  toJSON() {
    return {
      id: this.name,
      path: this.options.path || this.name,
      deps: Array.from(this.deps),
      version: this.options.version,
      asset: this
    };
  }
}

module.exports = Asset;
