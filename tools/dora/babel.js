const babelCore = require("@babel/core");
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const babelOptions = {
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

function transform(source) {
  return babelCore.transformSync(source, babelOptions); // => { code, map, ast }
}

function parse(code) {
  return babelParser.parse(code, {
    allowReturnOutsideFunction: true,
    strictMode: false,
    sourceType: 'module',
    // plugins: ['exportDefaultFrom', 'exportNamespaceFrom', 'dynamicImport']
  })
}

module.exports = {
  transform,
  parse,
  traverse
};
