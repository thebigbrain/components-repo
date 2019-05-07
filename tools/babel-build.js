const path = require('path');

const Builder = require('./dora/tranforms/builder');

const args = process.argv.slice(2);
const componentSrc = path.join(__dirname, '../src/', args[0]);
const out = path.join(__dirname, '../dist/', args[0]);

const builder = new Builder(componentSrc);
const deps = builder
  .transform()
  .getDeps();


console.log([
  {id: args[0], deps},
]);

builder.write(out);
