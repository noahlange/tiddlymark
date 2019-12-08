const { promises: fs } = require('fs');
const { resolve } = require('path');

const read = file =>
  fs.readFile(resolve(__dirname, '../.build/fs-plus', file), 'utf8');

module.exports = {
  plugins: {
    _: {
      noahlange: {
        _: {
          'fs-plus': {
            title: 'FileSystem+',
            description: 'fs+',
            author: 'Noah Lange',
            _: {
              readme: {
                text:
                  "This plugin modifies the standard Node filesystem sync adapter for better Markdown support. Upon save, any metadata is stringified to YAML and embedded as front matter into Markdown files, which are saved to disk using the .md extension. A custom deserializer parses files back into metadata and text content on load.\n\n//However//, because [[deserializers are borked|https://github.com/Jermolene/TiddlyWiki5/issues/4015]], you'll need to adjust or override ~TiddlyWiki's start script to swap in the new Markdown deserializer //before// it begins loading tiddlers.\n\n```javascript\nconst { TiddlyWiki } = require('tiddly-wiki');\nconst parse = require('gray-matter');\n\nconst $tw = new TiddlyWiki();\n\n$tw.modules.define(\n  '$:/plugins/noahlange/fs-plus/deserialize.js',\n  'tiddlerdeserializer',\n  {\n    'text/x-markdown'(text) {\n      const { content, data } = parse(text);\n      return [{ ...data, text: content }];\n    }\n  }\n);\n\n$tw.boot.argv = process.argv.slice(2);\n$tw.boot.boot();\n```"
              },
              'adapter.js': {
                'module-type': 'syncadaptor',
                type: 'application/javascript',
                text: read('adapter.js')
              }
            }
          }
        }
      }
    }
  }
};
