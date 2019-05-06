const path = require('path');
const fs = require('fs');

function jmodule(req, res, next) {
  let filePath = require.resolve(req.body.path);
  console.log(filePath);
  res.sendFile(filePath);
}

module.exports = {
  default: jmodule
};
