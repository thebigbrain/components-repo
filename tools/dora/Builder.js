const babelCore = require("@babel/core");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const Asset = require('./Asset');


const options = {
  presets: [
    "@babel/preset-react",
    '@babel/preset-env'
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
};

class Builder {
  constructor() {
    this.assetTree = new Map();
  }

  static transform(entry) {
    let asset = new Asset(entry);

    if (asset.isDoraModule) return asset;

    let source = asset.resolveLocal();
    let result = babelCore.transformSync(source, options); // => { code, map, ast }

    asset.code = result.code;

    return asset;
  }

  static parse(asset) {
    if (!asset.code) return;
    asset.ast = babelParser.parse(asset.code, {
      allowReturnOutsideFunction: true,
      strictMode: false,
      sourceType: 'module',
      // plugins: ['exportDefaultFrom', 'exportNamespaceFrom', 'dynamicImport']
    });
  }

  static getDeps(asset) {
    if (!asset.ast) return;
    traverse(asset.ast, {
      enter(path) {
        let node = path.node;
        if (node.type === 'CallExpression' && node.callee.name === 'require') {
          // noinspection JSAnnotator
          asset.deps.add(node.arguments[0].value);
        }
      }
    });
  }

  buildTree(entry) {
    const asset = Builder.transform(entry);
    Builder.parse(asset);
    Builder.getDeps(asset);

    this.assetTree.set(asset.name, asset);

    asset.resolveDeps(this.buildTree);
  }

  write() {
    console.log(this.assetTree);
  }
}

module.exports = Builder;
