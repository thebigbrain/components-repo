const level = require('level');

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
const db = level('components-repo');

function middleware(req, res, next) {
  console.log(db);
  res.send(db);
}

module.exports = {
  default: middleware
};
