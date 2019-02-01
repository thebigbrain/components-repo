const fs = require('fs');
const {unzipStream, compile} = require('../cloud/upload');


(async function main() {
  let pkg = await unzipStream(fs.createReadStream('./examples/demo.zip'));
  let info = await compile(pkg);
  console.log(info);
})();
