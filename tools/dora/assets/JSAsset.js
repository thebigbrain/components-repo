// const traverse = require('@babel/traverse').default;
// const codeFrame = require('@babel/code-frame').codeFrameColumns;
// const collectDependencies = require('../visitors/dependencies');
// const walk = require('babylon-walk');
const Asset = require('../Asset');
// const babelParser = require('@babel/parser');
// const insertGlobals = require('../visitors/globals');
// const fsVisitor = require('../visitors/fs');
// const envVisitor = require('../visitors/env');
// const processVisitor = require('../visitors/process');
// const babel = require('../transforms/babel/transform');
// const babel7 = require('../transforms/babel/babel7');
// const generate = require('@babel/generator').default;
// const terser = require('../transforms/terser');
// const SourceMap = require('../SourceMap');
// const hoist = require('../scope-hoisting/hoist');
// const loadSourceMap = require('../utils/loadSourceMap');
const isAccessedVarChanged = require('../utils/isAccessedVarChanged');

const babel = require('../babel');

// const IMPORT_RE = /\b(?:import\b|export\b|require\s*\()/;
// const ENV_RE = /\b(?:process\.env)\b/;
// const BROWSER_RE = /\b(?:process\.browser)\b/;
// const GLOBAL_RE = /\b(?:process|__dirname|__filename|global|Buffer|define)\b/;
// const FS_RE = /\breadFileSync\b/;
// const SW_RE = /\bnavigator\s*\.\s*serviceWorker\s*\.\s*register\s*\(/;
// const WORKER_RE = /\bnew\s*(?:Shared)?Worker\s*\(/;

class JSAsset extends Asset {
  constructor(name, options) {
    super(name, options);

    this.ast = null;
    this.code = null;
    this.type = 'js';
  }

  // traverse(visitor) {
  //   return traverse(this.ast, visitor, null, this);
  // }
  //
  // traverseFast(visitor) {
  //   return walk.simple(this.ast, visitor, this);
  // }

  collectDependencies() {
    // walk.ancestor(this.ast, collectDependencies, this);
    if (this.code == null) return null;
    let ast = babel.parse(this.code);
    let deps = this.deps;
    babel.traverse(ast, {
      enter(path) {
        let node = path.node;
        if (node.type === 'CallExpression' && node.callee.name === 'require') {
          // noinspection JSAnnotator
          deps.add(node.arguments[0].value);
        }
      }
    });
  }

  async transform() {
    // if (this.options.minify) {
    //   await terser(this);
    // }
    if (!this.options.source) return null;
    let result = babel.transform(this.options.source);
    this.code = result.code;
  }
}

module.exports = JSAsset;
