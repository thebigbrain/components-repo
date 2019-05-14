const path = require('path');
const Builder = require('./dora/Builder');

const posix = path.posix;

let entry = process.argv.slice(2)[0];

const builder = new Builder(entry);
builder.build();
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
