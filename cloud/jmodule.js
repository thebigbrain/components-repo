const path = require('path');
const fs = require('fs');

function jmodule(req, res, next) {
  let {id, type} = req.body;
  let out = {id, version: '1.0.0'};
  try {
    let entry = require(path.resolve(__dirname, '../dist', id, type || 'entry.json'));
    Object.assign(out, entry);
  } catch (e) {
    let modulePath = require.resolve(id);
    let code = fs.readFileSync(modulePath);
    out.code = code.toString();
  }

  res.json(out);
}

module.exports = {
  default: jmodule
};
