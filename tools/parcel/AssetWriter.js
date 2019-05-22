const fs = require('fs');
const path = require('path');
const {mkdirp} = require('@parcel/fs');
const {promisify} = require('@parcel/utils');
const {getId} = require('./util');

class AssetWriter {
  constructor(options) {
    this.options = options;
  }

  isLocal(asset) {
    return getId(asset.relativeName).startsWith('local:');
  }

  async setup(asset, outDir) {
    let id = getId(asset.relativeName);
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
    if (!this.isLocal(asset)) return;
    await this.setup(asset, outDir);
    // console.log(getId(asset.relativeName), asset.type, asset.generated[asset.type].length);
    this.dest.write(asset.generated[asset.type]);
    this.dest.end();

    console.log(asset.relativeName, Array.from(asset.dependencies.keys()));
  }

}

module.exports = AssetWriter;
