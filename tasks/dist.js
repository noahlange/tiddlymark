const { promises: fs } = require('fs');
const { ensureFile, mkdirp, copy } = require('fs-extra');
const { resolve, join } = require('path');

const opts = { cwd: resolve(__dirname, '../') };

module.exports = async function dist(spinner, plugins) {
  spinner.prefixText = 'dist';
  spinner.start();

  const dir = resolve(__dirname, '../plugins/.dist');
  const out = resolve(__dirname, './wiki/plugins');

  await Promise.all(
    plugins.map(async plugin => {
      spinner.text = plugin.name;
      const path = join(dir, `${plugin.name}/plugin.info`);
      await ensureFile(path);
      await fs.writeFile(path, plugin.text, 'utf8');
      await mkdirp(`./wiki/plugins/${plugin.name}`, opts);
    })
  );

  await copy('./plugins/.dist', './wiki/plugins', opts);

  spinner.text = `wrote ${plugins.length} plugins to "${out}"`;
  spinner.succeed();
};
