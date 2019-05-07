const babelCore = require("@babel/core");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const componentSrc = path.join(__dirname, '../src/', args[0]);
const out = path.join(__dirname, '../dist/', args[0]);

const options = {
  presets: [
    "@babel/preset-react",
    '@babel/preset-env'
  ],
};

let src = fs.readFileSync(path.resolve(componentSrc));
let result = babelCore.transformSync(src, options); // => { code, map, ast }

let ast = babelParser.parse(result.code, {
  allowReturnOutsideFunction: true,
  strictMode: false,
  sourceType: 'module',
  // plugins: ['exportDefaultFrom', 'exportNamespaceFrom', 'dynamicImport']
});

// console.log(JSON.stringify(ast));

const deps = [];

traverse(ast, {
  enter(path) {
    // if (path.isIdentifier({ name: "n" })) {
    //   path.node.name = "x";
    // }
    let node = path.node;
    if (node.type === 'CallExpression' && node.callee.name === 'require') {
      deps.push(node.arguments[0].value);
    }
  }
});

console.log({[args[0]]: deps});

fs.writeFileSync(out, result.code);

module.exports = {};
