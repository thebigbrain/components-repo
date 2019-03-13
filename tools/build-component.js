const path = require('path');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// const CompressionPlugin = require('compression-webpack-plugin');

const ComponentPlugin = require('./component-plugin');
const DirectoryNamedWebpackPlugin = require("directory-named-webpack-plugin");

const args = process.argv.slice(2);
const pkgPath = path.join(__dirname, '..', args[0], 'package.json');
const pkg = require(pkgPath);
const componentSrc = path.dirname(pkgPath);

const projectRoot = path.resolve(__dirname, '..');
const RootPkg = require(path.resolve('./package.json'));

const splitChunks = {
  chunks: 'all',
  // minSize: 50000,
  // maxSize: 300000,
  minChunks: 1,
  maxAsyncRequests: 10,
  maxInitialRequests: 5,
  automaticNameDelimiter: '~',
  name: true,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      priority: -20,
      reuseExistingChunk: true
    }
  }
};

const webpackConfig = {
  target: 'web',
  mode: 'production',
  entry: {
    // index: path.join(componentSrc, pkg.entry),
    // story: path.join(componentSrc, pkg.story)
  },
  output: {
    path: path.resolve(projectRoot, 'dist', pkg.name),
    chunkFilename: '[name].bundle.js',
    filename: '[name].js',
  },
  optimization: {
    // splitChunks,
    // minimizer: [new UglifyJsPlugin()],
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
    plugins: []
  },
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules|bower_components)/,
        include: componentSrc,
        use: [
          {
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
          }]
      },
      {
        test: /.json$/,
        use: ['json-loader']
      },
      {
        test: /.css$/,
        use: [
          // {
          //   loader: MiniCssExtractPlugin.loader
          // },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-preset-env')(),
                require('cssnano')(),
                require('autoprefixer')
              ]
            }
          }
        ]
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
  },
  plugins: [
    // new CleanWebpackPlugin([pkg.name], { root: path.resolve(projectRoot, 'dist') }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    // new CopyWebpackPlugin(['./package.json'], {context: componentSrc})
    // new ComponentPlugin(componentSrc)
  ]
};

function run(config) {
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        // Handle errors here
        reject(err || stats);
      }

      console.log('compile success');
      resolve()
    });
  });

}

function generateConfigs(type) {
  let config = Object.assign({}, webpackConfig);
  config.entry[type] = path.join(componentSrc, pkg[type]);
  let plugins = config.plugins.slice();
  plugins.push(new ComponentPlugin(componentSrc, type));
  config.plugins = plugins;
  return config;
}

async function build(entries) {
  for (entry of entries) {
    await run(generateConfigs(entry));
  }
}


(async () => {
  await build(['entry', 'story']);
})();
