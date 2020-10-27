// Wrapping the node-only code to avoid conditional imports in Adaptor.ts
(() => {
  if (!$tw.browser) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Adaptor } = require('./Adaptor');
    exports.adaptorClass = Adaptor;
  }
})();
