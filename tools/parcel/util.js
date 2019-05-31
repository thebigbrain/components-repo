function isNodeModule(name) {
  return name.search('node_modules') !== -1;
}

function getAssetId(asset) {
  let name = asset.relativeName;
  if (isNodeModule(name)) {
    return name.replace(/.*node_modules\//, 'npm:').replace(/\/index.js$/, '');
  } else {
    return `local:${name}`;
  }
}

function getDeps(deps) {
  let result = [];
  deps.forEach(d => {
    if (d.includedInParent) {
      // console.log(d);
      return null;
    }
    result.push(d.name);
  });
  return result;
}

module.exports = {
  getAssetId,
  getDeps
};
