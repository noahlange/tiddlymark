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
                type: 'text/x-markdown',
                text: fs.readFile(resolve(__dirname, './README.md'), 'utf8')
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
