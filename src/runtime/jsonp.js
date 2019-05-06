function jsonpScript(src) {
  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');

  script.charset = 'utf-8';
  script.timeout = 120;

  script.src = src;

  let onScriptComplete = function (event) {
    // avoid mem leaks in IE.
    script.onerror = script.onload = null;
    clearTimeout(timeout);
  };

  let timeout = setTimeout(function () {
    onScriptComplete({type: 'timeout', target: script});
  }, 120000);

  script.onerror = script.onload = onScriptComplete;
  head.appendChild(script);
}

export default jsonpScript;
