const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const dora = require('./dora');

const DORA_DIST_OUT = 'dist';
const DORA_PROJECT_ROOT = process.cwd();

class Asset {
  constructor(entry) {
    let root = DORA_PROJECT_ROOT;

    this.entry = entry;
    this.entryBasename = path.basename(entry);
    this.entryAbsoluteDir = path.dirname(entry);
    this.entryDir = this.entryAbsoluteDir.replace(path.join(root, 'src/'), '');

    this.outDir = path.join(root, DORA_DIST_OUT, this.entryDir);
    this.out = path.join(this.outDir, this.entryBasename);

    this.ast = null;
    this.code = null;

    this._deps = new Set();

    this.type = (path.extname(this.entry) || '.js').slice(1);
    this.path = null;
    this._init();
  }

  get deps() {
    return this._deps;
  }

  get isDoraModule() {
    return this._isDora;
  }

  _init() {
    let dora = path.resolve(this.entry);
    let found = dora.search('node_modules/');
    if (found !== -1) {
      this.name = dora.substr(found + 'node_modules/'.length);
      this.resolveDora();
      this._isDora = true;
    } else {
      this.name = path.resolve(entry).replace(path.join(DORA_PROJECT_ROOT, 'src/'), '');
      this._isDora = false;
    }
  }

  resolveDora() {
    let asset = dora.AssetStore[this.name];
    if (asset != null) {
      this.path = asset.path;
      this._deps = new Set(asset.deps);
    }
  }

  resolveLocal() {
    let root = DORA_PROJECT_ROOT;
    this.path = path.relative(path.join(root, 'src'), path.join(root, 'dist', this.name));
    return fs.readFileSync(path.resolve(this.entry), 'utf-8');
  }

  resolveDeps(resolver) {
    this._deps.forEach(dep => {
      resolver(dep.startsWith('.') ? path.join(this.entryDir, dep) : dep);
    });
  }

  toJSON() {
    const deps = [];
    this._deps.forEach(d => deps.push(d));
    return {id: this.name, path: this.path, deps};
  }

  write() {
    mkdirp.sync(this.outDir);
    fs.writeFileSync(this.out, this.code);
  }
}

module.exports = Asset;
