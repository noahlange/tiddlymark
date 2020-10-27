const { promises: fs } = require('fs');
const { resolve } = require('path');

module.exports = {
  plugins: {
    _: {
      noahlange: {
        _: {
          pretty: {
            description: 'pretty+',
            author: 'Noah Lange',
            _: {
              readme: {
                text: fs.readFile(resolve(__dirname, './README.tid'), 'utf8')
              },
              'pretty.js': {
                'module-type': 'startup',
                'global-module': true,
                text: fs.readFile(
                  resolve(__dirname, '../.build/pretty/pretty.js'),
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
