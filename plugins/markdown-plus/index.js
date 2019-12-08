const { promises: fs } = require('fs');
const { resolve } = require('path');

const read = file => fs.readFile(resolve(__dirname, '../.build', file), 'utf8');

module.exports = {
  languages: {
    _: {
      Docs: {
        _: {
          Types: {
            _: {
              text: {
                _: {
                  'x-markdown': {
                    description: 'Markdown',
                    name: 'text/x-markdown',
                    group: 'Text'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  plugins: {
    _: {
      noahlange: {
        _: {
          'markdown-plus': {
            _: {
              readme: {
                text:
                  "A plugin for parsing Markdown text and rendering it using ~JsonML. This allows us to take advantage of widgets and macros within Markdown text. It's based on ~TiddlyWiki's [[Markdown plugin|https://tiddlywiki.com/plugins/tiddlywiki/markdown]] and Khan Academy's [[simple-markdown|https://github.com/Khan/simple-markdown]] library.\n\nSyntax is broadly compatible with [[CommonMark|https://commonmark.org]] (save corner cases), and includes several helpful extensions. Specifics are detailed in [[usage|$:/plugins/noahlange/markdown-plus/usage]]."
              },
              usage:
                '! Usage\n\n!! Subscript & Superscript\n\n```markdown\nCO~2~\nmc^2^\n```\n\n!! Emoji & HTML entities\n\n```markdown\n:smile:\n&rarr;\n```\n\n!! Blocks\nInspired by [[markdown-it-container|https://github.com/markdown-it/markdown-it-container]], blocks behave like fenced code, but their contents are rendered as Markdown. Text immediately following the `:::` is trimed and added as to the class list of the resulting `div` element.\n\n```markdown\n::: foo\n\n_Italicized text._\n\n:::\n```\n\n!! Macros\nNormal syntax applies here.\n\n```markdown\n<<say-hi>>\n```',
              'markdown-plus.js': {
                'module-type': 'parser',
                type: 'application/javascript',
                text: read('markdown-plus/parser.js')
              },
              'new-markdown-button': {
                tags: '$:/tags/PageControls',
                caption:
                  '{{$:/plugins/noahlange/markdown-plus/images/new-markdown-button}} {{$:/language/Buttons/NewMarkdown/Caption}}',
                description: '{{$:/language/Buttons/NewMarkdown/Hint}}',
                'list-after': '$:/core/ui/Buttons/new-tiddler',
                text: `
                  <$button tooltip={{$:/language/Buttons/NewMarkdown/Hint}} aria-label={{$:/language/Buttons/NewMarkdown/Caption}} class=<<tv-config-toolbar-class>>>
                    <$action-sendmessage $message="tm-new-tiddler" type="text/x-markdown"/>
                    <$list filter="[<tv-config-toolbar-icons>prefix[yes]]">
                      {{$:/plugins/noahlange/markdown-plus/images/new-markdown-button}}
                    </$list>
                    <$list filter="[<tv-config-toolbar-text>prefix[yes]]">
                      <span class="tc-btn-text"><$text text={{$:/language/Buttons/NewMarkdown/Caption}}/></span>
                    </$list>
                  </$button>
                `
              },
              images: {
                _: {
                  'new-markdown-button': {
                    tags: '$:/tags/Image',
                    text: `
                      <svg class="tc-image-new-markdown-button tc-image-button" viewBox="0 0 128 128" width="22pt" height="22pt">
                        <g fill-rule="evenodd">
                          <rect width="48" height="16" x="80" y="96" rx="8"/>
                          <rect width="16" height="48" x="96" y="80" rx="8"/>
                          <path d="M9 95c-3-2-4-6-2-9L51 9c2-3 6-4 9-2l39 23c3 1 4 5 2 8l-44 77c-2 3-6 4-9 2L9 95zm-3 4l39 23c6 3 13 1 17-4l44-77c3-6 1-13-4-16L62 2c-5-3-13-1-16 5L2 83c-3 6-1 13 4 16zm44 7L18 88l5-10 18-2-7-16 6-10 31 19-5 9-18-11 6 16-17 3 18 11-5 9zm34-58l-24 5 5-10-16-9 5-9 17 9 5-9 8 23z"/>
                        </g>
                      </svg>
                    `
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
