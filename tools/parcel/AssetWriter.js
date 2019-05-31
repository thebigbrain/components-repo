const fs = require('fs');
const path = require('path');
const {mkdirp} = require('@parcel/fs');
const {promisify} = require('@parcel/utils');
const {getAssetId} = require('./util');

class AssetWriter {
  constructor(options) {
    this.options = options;

    this.depGraph = new Set();
  }

  isLocal(asset) {
    return getAssetId(asset).startsWith('local:');
  }

  async setup(asset, outDir) {
    let id = getAssetId(asset);
    let name = path.resolve(outDir, id.split(':')[1]);
    if (name.includes(path.sep)) {
      // console.log(path.dirname(asset.relativeName));
      await mkdirp(path.dirname(name));
    }

    this.dest = fs.createWriteStream(name);
    this.dest.write = promisify(this.dest.write.bind(this.dest));
    this.dest.end = promisify(this.dest.end.bind(this.dest));
  }

  async write(asset, outDir) {
    if (this.isLocal(asset)) {
      await this.setup(asset, outDir);
      this.dest.write(asset.generated[asset.type]);
      this.dest.end();
    }

    const posix = path.posix;
    let dirName = posix.dirname(asset.relativeName);

    const id = getAssetId(asset);
    const deps = [];
    asset.dependencies.forEach((v, k) => {
      if (v.includedInParent) return;

      if (v.name.startsWith('/')) {
        deps.push(`local:${v.name.substr(1)}`);
      } else if (v.name.startsWith('.')) {
        deps.push(`local:${posix.join(dirName, v.name)}`);
      } else {
        deps.push(v.name);
      }
    });

    this.depGraph.add({id, deps});
  }
}

module.exports = AssetWriter;
