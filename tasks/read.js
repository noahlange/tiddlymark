const { resolve, relative } = require('path');
const { homedir } = require('os');
const { promises: fs, statSync } = require('fs');

async function parsePlugin(data, path = '$:') {
  const { _ = {}, ...file } = data;

  const children = await Promise.all(
    Object.entries(_).map(([k, v]) => parsePlugin(v, path + '/' + k))
  );

  const files = children.reduce((a, b) => ({ ...a, ...b }), {});

  return Object.keys(file).length
    ? {
        ...files,
        [path]: await Object.entries(file).reduce(async (a, [k, v]) => {
          const [prev, value] = await Promise.all([a, v]);
          return { ...prev, [k]: value };
        }, Promise.resolve({ title: path, text: '' }))
      }
    : files;
}

async function readPlugin(name) {
  const data = require(`../plugins/${name}/index.js`);
  const res = await parsePlugin({ _: data });
  return { name, ...res };
}

module.exports = async function read(spinner) {
  const dir = resolve(__dirname, '../plugins');
  const rel = relative(homedir(), dir);

  spinner.prefixText = 'read';

  const res = await fs
    .readdir(dir)
    .then(plugins =>
      Promise.all(
        plugins
          // filter out hidden plugins...
          .filter(plugin => !plugin.startsWith('.'))
          // filter out files...
          .filter(plugin => !statSync(resolve(dir, plugin)).isFile())
          .map(plugin => readPlugin(plugin))
      )
    )
    .catch(e => console.error(e));

  spinner.text = `read ${res.length} plugins from "~/${rel}"`;
  spinner.succeed();

  return res;
};
