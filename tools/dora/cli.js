require('v8-compile-cache');
const program = require('commander');

program
  .command('build [entry]')
  .version('0.0.1', '-v, --version')
  .option('-o, --out <out>', 'output path')
  .option('-c, --config <config>', 'use a specified configuration file')
  .action(bundle);

program.parse(process.argv);

async function bundle(entry, cmd) {
  console.log('build ' + [entry, (cmd.config || '')].join(' '))
}
