const path = require('path');

function noop() {

}

class ComponentPlugin {
  constructor(context, entry) {
    this.context = context;
    this.entry = entry;

    this._imports = [];
    this._source = {};

    this._compiler = null;
  }

  apply(compiler) {
    this._compiler = compiler;

    compiler.hooks.compilation.tap('ComponentPlugin', compilation => {
      compilation.hooks.afterOptimizeAssets.tap('ComponentPlugin.afterOptimizeAssets', assets => {
        for (let k in assets) {
          this._source = assets[k].source();
        }
      });
    });

    compiler.hooks.normalModuleFactory.tap('ComponentPlugin', factory => {
      factory.hooks.parser.for('javascript/auto').tap('ComponentPlugin', (parser, options) => {
        parser.hooks.import.tap('ComponentPlugin.import', (statement, source) => {
          if (source.startsWith('.')) return;
          this._imports.push(source);
        });
      });
    });

    // compiler.hooks.shouldEmit.tap('CP.shouldEmit', () => false);

    compiler.hooks.done.tap('ComponentPlugin.done', () => {
      let pkg = this.getPkg();
      let data = {
        name: pkg.name,
        version: pkg.version,
        type: this.entry,
        imports: this._imports,
        code: this._source
      };
      this.writeFile(data);
    });
  }

  writeFile(data) {
    this._compiler.outputFileSystem.writeFile(
      path.resolve(this._compiler.outputPath, `${this.entry}.json`),
      JSON.stringify(data),
      noop
    );
  }

  getPkg() {
    return require(path.resolve(this.context, 'package.json'));
  }
}

module.exports = ComponentPlugin;
