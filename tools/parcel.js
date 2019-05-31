const Bundler = require('parcel-bundler');
const Path = require('path');
const fs = require('fs');
const AssetWriter = require('./parcel/AssetWriter');

// 入口文件路径
const entryFile = Path.join(__dirname, '../src/entry.js');
const entryHtml = Path.join(__dirname, '../public/index.html');

// Bundler 选项
const options = {
  production: true,
  bundleNodeModules: true,
  outDir: './dist', // 将生成的文件放入输出目录下，默认为 dist
  // outFile: 'entry.js', // 输出文件的名称
  publicUrl: './', // 静态资源的 url ，默认为 '/'
  watch: false, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
  cache: true, // 启用或禁用缓存，默认为 true
  cacheDir: '.cache', // 存放缓存的目录，默认为 .cache
  minify: false, // 压缩文件，当 process.env.NODE_ENV === 'production' 时，会启用
  target: 'browser', // 浏览器/node/electron, 默认为 browser
  https: false, // 服务器文件使用 https 或者 http，默认为 false
  logLevel: 3, // 3 = 输出所有内容，2 = 输出警告和错误, 1 = 输出错误
  // hmrPort: 0, // hmr socket 运行的端口，默认为随机空闲端口(在 Node.js 中，0 会被解析为随机空闲端口)
  sourceMaps: false, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
  // hmrHostname: '', // 热模块重载的主机名，默认为 ''
  detailedReport: false // 打印 bundles、资源、文件大小和使用时间的详细报告，默认为 false，只有在禁用监听状态时才打印报告,
};

// 使用提供的入口文件路径和选项初始化 bundler
const bundler = new Bundler(entryFile, options);
bundler.assetWriter = new AssetWriter({});
bundler.addPackager('js', require.resolve('./parcel/dummyPackager'));
bundler.addPackager('css', require.resolve('./parcel/dummyPackager'));

bundler.on('bundled', (bundle) => {
  // bundler 包含所有资源和 bundle，如需了解更多请查看文档
  // console.log(bundle.name, bundle.entryAsset.relativeName);
  // console.log(Array.from(bundle.assets).map(asset => asset.relativeName));
});

bundler.on('buildEnd', async () => {
  // 做一些操作……
  const deps = JSON.stringify(Array.from(bundler.assetWriter.depGraph));
  let html = fs.readFileSync(entryHtml, 'utf-8').toString();
  let bodyContent = findBodyContent(html);

  html = html.replace('%PUBLIC_URL%', '.');
  let headTailPos = html.search('</head>');
  html = insertAt(html, headTailPos, `
    <script type="text/javascript">window.__COMPONENTS_REPO_COMPONENTS_DEPENDENCY_GRAPH = ${deps};</script>
  `);

  removeScripts(bodyContent);
  fs.writeFileSync(
    Path.resolve(bundler.options.outDir, Path.basename(entryHtml)),
    html
  );
});

function insertAt(origin, pos, s) {
  let head = origin.substring(0, pos);
  let tail = origin.substring(pos);
  return `${head}${s}${tail}`;
}

function findBodyContent(html) {
  return findTagContent('body', html);
}

function findWrappedTagContent(tag, s) {
  let startPos = s.search(`<${tag}>`);
  let endPos = s.search(`</${tag}>`) + `</${tag}>`.length;
  return s.substring(startPos, endPos);
}

function findTagContent(tag, s) {
  let startPos = s.search(`<${tag}>`);
  let endPos = s.search(`</${tag}>`) + `</${tag}>`.length;
  return s.substring(startPos, endPos);
}

function removeScripts(bodyContent) {

}

// 运行 bundler，这将返回主 bundle
// 如果你正在使用监听模式，请使用下面这些事件，这是因为该 promise 只会触发一次，而不是每次重新构建时都触发
(async () => {
  const bundle = await bundler.bundle();
})();
