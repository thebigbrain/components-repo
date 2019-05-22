const Asset = require('../Asset');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');
const postcssTransform = require('../transforms/postcss');
// const CssSyntaxError = require('postcss/lib/css-syntax-error');
// const SourceMap = require('../SourceMap');
// const loadSourceMap = require('../utils/loadSourceMap');
// const path = require('path');
// const urlJoin = require('../utils/urlJoin');
// const isURL = require('../utils/is-url');

const URL_RE = /url\s*\("?(?![a-z]+:)/;
const IMPORT_RE = /@import/;
const COMPOSES_RE = /composes:.+from\s*("|').*("|')\s*;?/;
const FROM_IMPORT_RE = /.+from\s*(?:"|')(.*)(?:"|')\s*;?/;
const PROTOCOL_RE = /^[a-z]+:/;

class CSSAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'css';
  }

  mightHaveDependencies() {
    return (
      !/\.css$/.test(this.name) ||
      IMPORT_RE.test(this.contents) ||
      COMPOSES_RE.test(this.contents) ||
      URL_RE.test(this.contents)
    );
  }

  parse(code) {
    let root = postcss.parse(code, {
      from: this.name
    });
    return new CSSAst(code, root);
  }

  collectDependencies() {
    this.ast.root.walkAtRules('import', rule => {
      let params = valueParser(rule.params);
      let [name, ...media] = params.nodes;
      let dep;
      if (
        name.type === 'function' &&
        name.value === 'url' &&
        name.nodes.length
      ) {
        name = name.nodes[0];
      }

      dep = name.value;

      if (!dep) {
        throw new Error('Could not find import name for ' + rule);
      }

      if (PROTOCOL_RE.test(dep)) {
        return;
      }

      // If this came from an inline <style> tag, don't inline the imported file. Replace with the correct URL instead.
      // TODO: run CSSPackager on inline style tags.
      let inlineHTML =
        this.options.rendition && this.options.rendition.inlineHTML;
      if (inlineHTML) {
        name.value = this.addURLDependency(dep, {loc: rule.source.start});
        rule.params = params.toString();
      } else {
        media = valueParser.stringify(media).trim();
        this.addDependency(dep, {media, loc: rule.source.start});
        rule.remove();
      }

      this.ast.dirty = true;
    });

    this.ast.root.walkDecls(decl => {
      if (URL_RE.test(decl.value)) {
        let parsed = valueParser(decl.value);
        let dirty = false;

        parsed.walk(node => {
          if (
            node.type === 'function' &&
            node.value === 'url' &&
            node.nodes.length
          ) {
            let url = this.addURLDependency(node.nodes[0].value, {
              loc: decl.source.start
            });
            if (!isURL(url)) {
              url = urlJoin(this.options.publicURL, url);
            }
            dirty = node.nodes[0].value !== url;
            node.nodes[0].value = url;
          }
        });

        if (dirty) {
          decl.value = parsed.toString();
          this.ast.dirty = true;
        }
      }

      if (decl.prop === 'composes' && FROM_IMPORT_RE.test(decl.value)) {
        let parsed = valueParser(decl.value);

        parsed.walk(node => {
          if (node.type === 'string') {
            const [, importPath] = FROM_IMPORT_RE.exec(decl.value);
            this.addURLDependency(importPath, {
              dynamic: false,
              loc: decl.source.start
            });
          }
        });
      }
    });
  }

  async transform() {
    await postcssTransform(this);
  }

  getCSSAst() {
    // Converts the ast to a CSS ast if needed, so we can apply postcss transforms.
    if (!(this.ast instanceof CSSAst)) {
      this.ast = CSSAsset.prototype.parse.call(
        this,
        this.ast.render(this.name)
      );
    }

    return this.ast.root;
  }

  async generate() {
    let css;
    if (this.ast) {
      let result = this.ast.render(this.name);
      css = result.css;
    } else {
      css = this.contents;
    }

    let js = '';
    if (this.cssModules) {
      js +=
        'module.exports = ' + JSON.stringify(this.cssModules, null, 2) + ';';
    }

    return [
      {
        type: 'css',
        value: css,
        cssModules: this.cssModules
      },
      {
        type: 'js',
        value: js,
        hasDependencies: false
      }
    ];
  }
}

class CSSAst {
  constructor(css, root) {
    this.css = css;
    this.root = root;
    this.dirty = false;
  }

  render(name) {
    if (this.dirty) {
      let {css, map} = this.root.toResult({
        to: name,
        map: {inline: false, annotation: false, sourcesContent: true}
      });

      this.css = css;

      return {
        css: this.css,
        map: map ? map.toJSON() : null
      };
    }

    return {
      css: this.css
    };
  }
}

module.exports = CSSAsset;
