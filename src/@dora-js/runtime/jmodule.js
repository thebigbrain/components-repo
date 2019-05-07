class JModule {
  constructor({id, code, deps, require, version}) {
    this.id = id;
    this.version = version;
    this.code = code;
    this.deps = deps;
    this.require = require;

    this.exports = {};
  }

  instantiate() {
    // eslint-disable-next-line
    let fn = new Function('module', 'exports', 'require', `${this.code}`);
    fn(this, this.exports, this.require);
  }
}

export default JModule;
