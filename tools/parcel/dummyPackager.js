const {Packager} = require('parcel-bundler');

class MyPackager extends Packager {
  async setup() {
    this.writer = this.bundler.assetWriter;
  }

  async start() {
    // 可选，写文件头部内容
    // await this.dest.write();
  }

  async addAsset(asset) {
    // 必须。将资源写入生成文件。
    // await this.dest.write(JSON.stringify({id, deps}) + ',');
    await this.writer.write(asset, this.options.outDir);
  }

  getSize() {
    return 0;
  }

  async end() {
    // 可选，写文件尾内部内容。
    // await this.dest.end();
  }
}

module.exports = MyPackager;
