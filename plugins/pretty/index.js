const { promises: fs } = require('fs');
const { resolve } = require('path');

module.exports = {
  plugins: {
    _: {
      noahlange: {
        _: {
          'pretty-plus': {
            description: 'pretty+',
            author: 'Noah Lange',
            _: {
              readme: {
                text: `
                  ! pretty-plus
                  Format-on-save hook for ''~TiddlyWiki'', powered by [ext[prettier|https://prettier.io]]. Capable of re-formatting a variety of file-types:
                    * HTML
                    * Markdown
                    * ~JavaScript, JSON
                    * ~TypeScript
                    * CSS, SCSS, LESS
                `
              },
              'pretty-plus.js': {
                'module-type': 'startup',
                'global-module': true,
                text: fs.readFile(
                  resolve(__dirname, '../.build/pretty-plus/pretty-plus.js'),
                  'utf8'
                )
              }
            }
          }
        }
      }
    }
  }
};
