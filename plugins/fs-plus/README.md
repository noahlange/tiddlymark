# fs+

**fs+** modifies the standard Node.js filesystem sync adapter to be a little
Markdown a little more file-system/git friendly. By default, TiddlyWiki will
save a metadata file for each Markdown—by comparison, `.tid` files are saved
with inline metadata. This creates a lot of unnecessary clutter.

**fs+** modifies file-system writing so that upon save, the metadata in a
Markdown tiddler is stringified to YAML, embedded as front matter and saved to
disk as `.md` files. A custom deserializer parses files back into metadata and
text content on load.

However, because either
[deserializers are borked](https://github.com/Jermolene/TiddlyWiki5/issues/4015)
or my _understanding_ of deserializers is borked, you'll need to adjust or
override TiddlyWiki's start script to swap in the new Markdown deserializer
_before_ it begins loading tiddlers.

```javascript
const { TiddlyWiki } = require('tiddly-wiki');
const parse = require('gray-matter');

const $tw = new TiddlyWiki();

$tw.modules.define(
  '$:/plugins/noahlange/fs-plus/deserialize.js',
  'tiddlerdeserializer',
  {
    'text/x-markdown'(text) {
      const { content, data } = parse(text);
      return [{ ...data, text: content }];
    }
  }
);

$tw.boot.argv = process.argv.slice(2);
$tw.boot.boot();
```
