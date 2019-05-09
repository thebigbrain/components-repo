const path = require('path');

const Builder = require('./dora/Builder');

const args = process.argv.slice(2);
const entry = path.join(__dirname, '../src/', args[0]);

const builder = new Builder();
const tree = builder.buildTree(entry);
// const deps = builder
//   .transform(entry)
//   .getDeps();
//
//
// console.log([
//   {id: args[0], deps},
// ]);

// console.log(builder.entry, builder.entryBasename, builder.entryDir, builder.entryAbsoluteDir, builder.root);

// deps.forEach(dep => console.log(require.resolve(dep)));

builder.write();
