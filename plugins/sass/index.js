const { promises: fs } = require('fs');
const { resolve } = require('path');

const read = file =>
  fs.readFile(resolve(__dirname, '../.build/sass', file), 'utf8');

module.exports = {
  core: {
    _: {
      ui: {
        _: {
          PageStylesheet: {
            text: fs.readFile(
              resolve(__dirname, './tiddlers/PageTemplate.tid'),
              'utf8'
            )
          }
        }
      }
    }
  },
  plugins: {
    _: {
      noahlange: {
        _: {
          sass: {
            description: 'SASS stylesheet support.',
            author: 'Noah Lange',
            _: {
              'hook.js': {
                'module-type': 'startup',
                'global-module': true,
                text: read('hook.js')
              },
              'sass-parser.js': {
                'module-type': 'parser',
                type: 'application/javascript',
                text: read('parser.js')
              },
              'sass.js': {
                'module-type': 'library',
                'global-module': true,
                text: read('sass.js')
              },
              'sass-styles.css': {
                tags: ['$:/tags/Stylesheet'],
                text: '',
                cache: '{}'
              }
            }
          }
        }
      }
    }
  }
};
