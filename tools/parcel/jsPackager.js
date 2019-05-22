const {Packager} = require('parcel-bundler');
const {getDeps, getId} = require('./util');

class MyPackager extends Packager {
  async start() {
    // 可选，写文件头部内容
    await this.dest.write('window.__COMPONENTS_REPO_COMPONENTS_DEPENDENCY_GRAPH = [');
  }

  async addAsset(asset) {
    // 必须。将资源写入生成文件。
    // if (!/node_modules/.test(asset.name)) {
    //   console.log(asset.relativeName, asset.generated);
    // }
    // console.log(asset.relativeName, asset.dependencies.size);
    const id = getId(asset.relativeName);
    const deps = getDeps(asset.dependencies);
    await this.dest.write(JSON.stringify({id, deps}) + ',');
  }

  async end() {
    // 可选，写文件尾内部内容。
    await this.dest.end('];//window.__COMPONENTS_REPO_COMPONENTS_DEPENDENCY_GRAPH');
  }
}

module.exports = MyPackager;
