const path = require('path');
const {Packager} = require('parcel-bundler');
const {getDeps, getId} = require('./util');

class CSSPackager extends Packager {
  async start() {
    // await this.dest.write();
  }

  async addAsset(asset) {
    let css = asset.generated.css || '';

    // Figure out which media types this asset was imported with.
    // We only want to import the asset once, so group them all together.
    let media = [];
    for (let dep of asset.parentDeps) {
      if (!dep.media) {
        // Asset was imported without a media type. Don't wrap in @media.
        media.length = 0;
        break;
      } else {
        media.push(dep.media);
      }
    }

    // If any, wrap in an @media block
    if (media.length) {
      css = `@media ${media.join(', ')} {\n${css.trim()}\n}\n`;
    }

    // console.log(asset.relativeName);

    const id = getId(asset.relativeName);
    const deps = getDeps(asset.dependencies);

    await this.dest.write(JSON.stringify({id, deps}) + ',');
  }

  async end() {
    // await this.dest.end();
  }
}

module.exports = CSSPackager;
