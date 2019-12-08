const { resolve, relative } = require('path');
const { homedir } = require('os');
const { promises: fs } = require('fs');

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
          const res = await a;
          const value = await v;
          return { ...res, [k]: value };
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
  spinner.prefixText = 'read';

  const directory = resolve(__dirname, '../plugins');
  const rel = relative(homedir(), directory);
  const plugins = await fs.readdir(directory);

  const res = await Promise.all(
    plugins
      .filter(plugin => !plugin.startsWith('.'))
      .map(name => {
        spinner.text = `reading plugin ${name}`;
        return readPlugin(name);
      })
  );

  spinner.text = `read ${res.length} plugins from "~/${rel}"`;
  spinner.succeed();
  return res;
};
