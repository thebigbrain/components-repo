class JModule {
  constructor({id, version, code, require}) {
    this.id = id;
    this.version = version;
    this.code = code;
    // this.imports = imports;
    this.require = require;

    this.exports = {};
  }

  instantiate() {
    // eslint-disable-next-line
    let fn = new Function('module', 'exports', 'require', `"use strict"; module.exports=${this.code}`);
    fn(this, this.exports, this.require);
  }
}

export default JModule;
