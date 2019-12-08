const { promises: fs } = require('fs');
const { resolve } = require('path');

const types = [
  'application/javascript',
  'application/json',
  'application/x-tiddler-dictionary',
  'text/css',
  'text/scss',
  'text/sass',
  'text/html',
  'text/plain',
  `text/markdown`,
  'text/vnd.tiddlywiki',
  'text/x-markdown',
  'text/x-tiddlywiki',
  'image/svg+xml'
];

const read = file => fs.readFile(resolve(__dirname, '../.build', file), 'utf8');

module.exports = {
  config: {
    _: {
      EditorTypeMappings: {
        _: types.reduce((a, type) => ({ ...a, [type]: { text: 'monaco' } }), {})
      },
      monaco: {
        _: {
          cursorStyle: {
            info: 'Controls the cursor style.',
            type: 'enum:block,line',
            text: 'line'
          },
          cursorWidth: {
            info: 'Controls width of line cursor.',
            type: 'number',
            text: ''
          },
          cursorBlinking: {
            info: 'Controls cursor animation style.',
            type: 'enum:blink,smooth,phase,expand,solid',
            text: 'blink'
          },
          fontFamily: {
            info: 'Editor font family.',
            type: 'string'
          },
          fontLigatures: {
            info: 'Enable font ligatures.',
            type: 'boolean',
            text: ''
          },
          fontSize: {
            info: 'Editor font size.',
            type: 'number'
          },
          fontWeight: {
            info: 'Weight of editor font.',
            type:
              'enum:normal,bold,bolder,lighter,initial,inherit,100,200,300,400,500,600,700,800,900'
          },
          lineHeight: {
            info: 'Editor line height.',
            type: 'number'
          },
          lineNumbers: {
            info: 'Controls rendering of line numbers.',
            type: 'enum:on,off,relative,internal',
            text: 'on'
          },
          letterSpacing: {
            info: 'Character spacing.',
            type: 'number'
          },
          theme: {
            info:
              'Editor color theme ([[examples|https://editor.bitwiser.in/]]).',
            type: 'enum:vs,vs-dark,hc-black',
            text: 'vs'
          },
          customTheme: {
            info: 'JSON definition of custom theme.',
            type: 'json'
          },
          colorDecorators: {
            info: 'Enable inline color decorators and color picker rendering.',
            type: 'boolean',
            text: true
          },
          wordWrap: {
            info: '',
            type: 'enum:off,on,wordWrapColumn,bounded',
            text: 'on'
          },
          wordWrapColumn: {
            info: '',
            type: 'number',
            text: 80
          },
          wrappingIndent: {
            info: '',
            type: 'enum:none,same,indent,deepIndent',
            text: 'same'
          },
          minimap: {
            _: {
              enabled: {
                info: 'Display minimap?',
                type: 'boolean',
                text: true
              },
              side: {
                info: '',
                type: 'enum:right,left',
                text: 'right'
              },
              showSlider: {
                info: 'Display minimap scrollbar?',
                type: 'enum:always,mouseover',
                text: 'mouseover'
              },
              renderCharacters: {
                info: 'Render text (instead of color blobs)?',
                type: 'boolean',
                text: true
              },
              maxColumn: {
                info: 'Minimap column width.',
                type: 'number',
                text: 120
              }
            }
          }
        }
      }
    }
  },
  language: {
    _: {
      monaco: {
        _: {
          // todo
        }
      }
    }
  },
  plugins: {
    _: {
      noahlange: {
        _: {
          monaco: {
            _: {
              'plugin.info': {},
              readme: {
                text:
                  "Visual Studio Code's Monaco text editor, repackaged for TiddlyWiki."
              },
              'entry.js': {
                text: read('monaco/entry.js'),
                'module-type': 'widget'
              },
              'engine.js': {
                text: read('monaco/engine.js'),
                'module-type': 'library'
              },
              'route.js': {
                text: read('monaco/route.js'),
                'module-type': 'route'
              }
            }
          }
        }
      }
    }
  }
};
