const path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const unzip = require('unzip-stream');

const fs = new MemoryFS();

const webpackConfig = {
  mode: 'production',
  entry: '/webpack/build/bundle/'
};

function compile(entry) {
  webpackConfig.entry = path.posix.join(webpackConfig.entry, entry);
  const compiler = webpack(webpackConfig);
  compiler.inputFileSystem = fs;
  compiler.outputFileSystem = fs;
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        resolve(err.details || err.stack || err);
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        resolve(info.errors);
      }

      if (stats.hasWarnings()) {
        resolve(info.warnings);
      }

      resolve(info);
    });
  });
}

function __unzipRequest(req, resolve, reject) {
  let pkg = null;
  req.pipe(unzip.Parse())
    .on('entry', (entry) => {
      let filePath = `${webpackConfig.entry}${entry.path}`;
      let type = entry.type; // 'Directory' or 'File'
      let size = entry.size; // might be undefined in some archives

      if (!entry.isDirectory) {
        if (/package\.json$/.test(entry.path)) pkg = entry.path;
        entry.pipe(fs.createWriteStream(filePath));
      } else if (entry.isDirectory) {
        fs.mkdirpSync(filePath);
      } else {
        entry.autodrain();
      }
    }).on('close', () => {
      if (pkg == null) {
        reject('package.json not found')
      } else {
        let content = fs.readFileSync(`${webpackConfig.entry}${pkg}`);
        let package = JSON.parse(content.toString());
        package.entry = path.posix.join(pkg, '..', package.entry);
        resolve(package);
      }
  });
}

function unzipRequest(req) {
  return new Promise((resolve, reject) => {
    __unzipRequest(req, resolve, reject);
  });
}

async function upload(req, res, next) {
  let pkg = await unzipRequest(req);
  let info = await compile(pkg.entry);
  res.send(info);
}

module.exports = upload;
