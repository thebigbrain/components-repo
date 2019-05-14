const Resolver = require('./Resolver');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class Builder {
  constructor(entry) {
    this.entry = entry.startsWith('.') ? entry : `./${entry}`;

    this.resolver = new Resolver({
      root: process.cwd(),
      debug: true
    });

    this.tree = null;
  }

  build() {
    this.tree = this.resolver.resolve(this.entry);
  }

  write() {
    if (this.tree == null) return;
    console.log(this.tree);
  }
}

module.exports = Builder;
