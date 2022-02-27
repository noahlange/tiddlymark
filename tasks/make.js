const { join } = require('path');
const { timestampFor } = require('./utils');
const {
  author,
  version,
  repository,
  dependencies
} = require('../package.json');

const ts = timestampFor(new Date());
const name = author.replace(/(<.+>)/, '');
const namespace = name.replace(/\s/g, '').toLowerCase();
const tw = dependencies.tiddlywiki.replace('^', '');

const info = {
  created: ts,
  modified: ts,
  creator: name,
  modifier: name
};

function tiddlersFrom(plugin) {
  const tiddlers = { ...plugin };
  delete tiddlers.name;
  for (const title in tiddlers) {
    const tiddler = tiddlers[title];
    tiddlers[title] = {
      ...info,
      type: 'text/vnd.tiddlywiki',
      ...tiddler
    };
  }
  return tiddlers;
}

module.exports = function make(spinner, plugins) {
  spinner.prefixText = 'make';

  const res = plugins.map(plugin => {
    const tiddlers = tiddlersFrom(plugin);
    spinner.text = `making plugin ${plugin.name}`;

    return {
      name: plugin.name,
      text: JSON.stringify(
        {
          title: join(`$:/plugins/${namespace}/${plugin.name}`),
          ...info,
          ...plugin.meta,
          'core-version': `>=${tw}`,
          'plugin-type': 'plugin',
          type: 'application/json',
          version,
          list: 'readme',
          source: repository.url,
          tiddlers
        },
        null,
        2
      )
    };
  });

  spinner.text = `bundled ${res.length} plugins`;
  spinner.succeed();
  return res;
};
