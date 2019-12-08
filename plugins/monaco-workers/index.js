const { promises: fs } = require('fs');
const { resolve } = require('path');

const read = file =>
  fs.readFile(resolve(__dirname, '../.build/monaco/workers', file), 'utf8');

module.exports = {
  plugins: {
    _: {
      noahlange: {
        _: {
          monaco: {
            _: {
              'css.worker.js': {
                type: 'application/javascript',
                text: read('css.worker.js')
              },
              'editor.worker.js': {
                type: 'application/javascript',
                text: read('editor.worker.js')
              },
              'html.worker.js': {
                type: 'application/javascript',
                text: read('html.worker.js')
              },
              'json.worker.js': {
                type: 'application/javascript',
                text: read('json.worker.js')
              },
              'typescript.worker.js': {
                type: 'application/javascript',
                text: read('ts.worker.js')
              },
              workers: {
                'plugin.info': {}
              }
            }
          }
        }
      }
    }
  }
};
