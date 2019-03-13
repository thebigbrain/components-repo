const babel = require("@babel/core");
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const pkgPath = path.join(__dirname, '..', args[0], 'package.json');
const pkg = require(pkgPath);
const componentSrc = path.dirname(pkgPath);

const options = {
  presets: ["@babel/preset-react"]
};

let code = fs.readFileSync(path.resolve(componentSrc, pkg.entry));
let result = babel.transformSync(code, options); // => { code, map, ast }


console.log(result.code);
