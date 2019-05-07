const babelCore = require("@babel/core");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

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
  constructor(src) {
    this.src = src;
    this.dir = path.dirname(src);
    this.ast = null;
    this.code = null;
    // this.sourceMap = null;
  }

  transform() {
    let src = fs.readFileSync(path.resolve(this.src));
    let result = babelCore.transformSync(src, options); // => { code, map, ast }
    this.code = result.code;
    // this.ast = result.ast;
    // this.sourceMap = result.map;
    return this;
  }

  parse() {
    if (this.ast != null) return;
    this.ast = babelParser.parse(this.code, {
      allowReturnOutsideFunction: true,
      strictMode: false,
      sourceType: 'module',
      // plugins: ['exportDefaultFrom', 'exportNamespaceFrom', 'dynamicImport']
    });
  }

  getDeps() {
    this.parse();
    const deps = [];

    traverse(this.ast, {
      enter(path) {
        let node = path.node;
        if (node.type === 'CallExpression' && node.callee.name === 'require') {
          // noinspection JSAnnotator
          deps.push(node.arguments[0].value);
        }
      }
    });

    return deps;
  }

  write(out) {
    const outDir = path.dirname(out);
    mkdirp.sync(outDir);
    fs.writeFileSync(out, this.code);
  }
}

module.exports = Builder;
