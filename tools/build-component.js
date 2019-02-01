const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
// const CompressionPlugin = require('compression-webpack-plugin');


const splitChunks = {
  chunks: 'all',
  // minSize: 50000,
  // maxSize: 300000,
  minChunks: 1,
  maxAsyncRequests: 10,
  maxInitialRequests: 5,
  // automaticNameDelimiter: '~',
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

const babelLoader = {
  test: /.js$/,
  exclude: /(node_modules|bower_components)/,
  include: null,
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

const cssLoader = {
  test: /.css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader
    },
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
};

const webpackOutput = {
  path: path.resolve(__dirname, 'dist'),
  chunkFilename: '[name].bundle.js',
  filename: '[name].js'
};

const webpackConfig = {
  target: 'web',
  mode: 'production',
  entry: null,
  output: webpackOutput,
  optimization: {
    splitChunks
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
  },
  module: {
    rules: [
      babelLoader,
      {
        test: /.json$/,
        use: ['json-loader']
      },
      cssLoader,
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
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    })
  ]
};

let args = process.argv.slice(2);
let pkgPath = path.join(__dirname, '..', args[0], 'package.json');
let pkg = require(pkgPath);

const componentSrc = path.dirname(pkgPath);
babelLoader.include = componentSrc;
webpackOutput.path = path.join(componentSrc, 'dist');
webpackConfig.entry = {
  index: path.join(componentSrc, pkg.entry),
  story: path.join(componentSrc, pkg.story)
};

webpack(webpackConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    // Handle errors here
    throw err || stats;
  }
  console.log('compile success');
});
