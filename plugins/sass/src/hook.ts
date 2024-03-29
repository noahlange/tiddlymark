import * as sass from '$:/plugins/noahlange/sass/sass.js';
const cache = '$:/plugins/noahlange/sass/sass-styles.css';

function cacheToStyles(cache: Record<string, string>): string {
  return Object.entries(cache).reduce((a, [key, value]) => {
    return [a, `/* ${key} */`, value].join('\n');
  }, '');
}

export function startup(): void {
  $tw.hooks.addHook('th-saving-tiddler', (tiddler: Tiddler): Tiddler | null => {
    let result: Tiddler | null = tiddler;
    const isStylesheet = tiddler.hasTag('$:/tags/Stylesheet');
    const isSASS = /text\/s(c|a)ss/gim.test(tiddler.fields.type as string);
    if (isStylesheet && isSASS) {
      sass
        .compile(tiddler.fields.text as string)
        .then(text => {
          const css = $tw.wiki.getTiddler<{ cache: string }>(cache);
          const parsed = JSON.parse(css.fields.cache || '{}');
          parsed[tiddler.fields.title as string] = text;
          $tw.wiki.addTiddler(
            new $tw.Tiddler(css, {
              text: cacheToStyles(parsed),
              cache: JSON.stringify(parsed),
              type: 'text/css'
            })
          );
        })
        .catch(e => {
          $tw.utils.error(e);
          result = null;
        });
    }
    return result;
  });
}

const execute = $tw.modules.execute;
$tw.modules.execute = (name: string, root: string): Record<string, unknown> => {
  const o = execute(name, root);
  return o?.default ?? o;
};
