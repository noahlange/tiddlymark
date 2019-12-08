import { editTextWidgetFactory } from '$:/core/modules/editor/factory.js';

if ($tw.browser) {
  // In this case, we need to use TiddlyWiki's require; no relation to Node's.
  /* eslint-disable @typescript-eslint/no-var-requires */
  const { MonacoEngine } = require('$:/plugins/noahlange/monaco/engine.js');
  exports['edit-monaco'] = exports['monaco'] = editTextWidgetFactory(
    MonacoEngine,
    MonacoEngine
  );
}
