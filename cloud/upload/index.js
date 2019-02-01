const _path = require('path');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const unzip = require('unzip-stream');
const stream = require('stream');

const path = _path.posix;

const fs = new MemoryFS();

const babelLoader = {
  test: /.js$/,
  exclude: /(node_modules|bower_components)/,
  include: path.resolve(__dirname, 'src'),
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
        {
          'plugins': [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-transform-runtime'
          ]
        }
      ]
    }
  }
};

const webpackConfig = {
  target: 'web',
  mode: 'production',
  entry: '/webpack/build/',
  output: {
    path: '/webpack/bundle/dist',
    chunkFilename: '[name].bundle.js',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      babelLoader,
      {
        test: /.json$/,
        use: ['json-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  }
};

function compile(pkg) {
  // babelLoader.include = pkg.dir;
  webpackConfig.entry = pkg.entry;
  webpackConfig.output.filename = `${pkg.name}.bundle.js`;
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

function __transformCallback(entry, encoding, callback) {
  let pkg = null;
  let filePath = `${webpackConfig.entry}${entry.path}`;
  let type = entry.type; // 'Directory' or 'File'
  let size = entry.size; // might be undefined in some archives

  if (!entry.isDirectory) {
    if (/package\.json$/.test(entry.path)) pkg = filePath;
    entry.pipe(fs.createWriteStream(filePath)).on('finish', callback);
  } else if (entry.isDirectory) {
    fs.mkdirpSync(filePath);
  } else {
    entry.autodrain();
  }
}

function __unzipRequest(webpackConfig, req, resolve, reject) {
  let pkgPath = null;
  req
    .pipe(unzip.Parse())
    .pipe(stream.Transform({
      objectMode: true,
      transform(entry, encoding, callback) {
        let filePath = `${webpackConfig.entry}${entry.path}`;
        if (!entry.isDirectory) {
          if (/package\.json$/.test(entry.path)) {
            pkgPath = filePath;
          }
          entry.pipe(fs.createWriteStream(filePath)).on('finish', callback);
        } else if (entry.isDirectory) {
          fs.mkdirpSync(filePath);
          callback();
        } else {
          entry.autodrain();
        }
      }
    }))
    .on('finish', () => {
      if (pkgPath == null) {
        reject('package.json not found')
      } else {
        let content = fs.readFileSync(pkgPath);
        let pkg = JSON.parse(content.toString());
        pkg.dir = path.dirname(pkgPath);
        pkg.entry = path.join(pkg.dir, pkg.entry);
        resolve(pkg);
      }
    });
}

function unzipStream(req) {
  return new Promise((resolve, reject) => {
    __unzipRequest(webpackConfig, req, resolve, reject);
  });
}

async function upload(req, res, next) {
  let pkg = await unzipStream(webpackConfig, req);
  let info = await compile(pkg);
  res.send(info);
}

module.exports = {
  default: upload,
  unzipStream,
  compile
};
