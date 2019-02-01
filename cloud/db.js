const level = require('level');

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
const db = level('components-repo');

module.exports = (req, res, next) => {
  console.log(db);
  res.send(db);
};
