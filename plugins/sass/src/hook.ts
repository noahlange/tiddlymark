interface SassResult {
  status: 0 | unknown;
  text: string;
}

import Sass from 'sass.js/dist/sass.sync.js';
const title = '$:/plugins/noahlange/sass/sass-styles.css';

function cacheToStyles(cache: Record<string, string>): string {
  return Object.entries(cache).reduce((a, [key, value]) => {
    return [a, `/* ${key} */`, value].join('\n');
  }, '');
}

exports.startup = () => {
  $tw.hooks.addHook('th-saving-tiddler', (tiddler: Tiddler) => {
    const isStylesheet = tiddler.hasTag('$:/tags/Stylesheet');
    const isSASS = /text\/s(c|a)ss/gim.test(tiddler.fields.type);
    if (isStylesheet && isSASS) {
      Sass.compile(tiddler.fields.text, (res: SassResult) => {
        if (res.status === 0) {
          const css = $tw.wiki.getTiddler<{ cache: string }>(title);
          const parsed = JSON.parse(css.fields.cache || '{}');
          parsed[tiddler.fields.title] = res.text;
          $tw.wiki.addTiddler(
            new $tw.Tiddler(css, {
              text: cacheToStyles(parsed),
              cache: JSON.stringify(parsed)
            })
          );
        }
      });
    }
    return tiddler;
  });

  // done();
};
