const babel = require("@babel/core");
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const componentSrc = path.join(__dirname, '../src/', args[0]);
const out = path.join(__dirname, '../dist/', args[0]);

const options = {
  presets: ["@babel/preset-react"]
};

let code = fs.readFileSync(path.resolve(componentSrc));
let result = babel.transformSync(code, options); // => { code, map, ast }

fs.writeFileSync(out, result.code);

module.exports = {};
