const { promises: fs } = require('fs');
const { exec } = require('child_process');
const { ensureFile } = require('fs-extra');
const { resolve, relative, join } = require('path');
const { homedir } = require('os');
const { promisify } = require('util');

const cmd = promisify(exec);
const opts = { cwd: resolve(__dirname, '../') };

module.exports = async (spinner, plugins) => {
  spinner.prefixText = 'dist';
  spinner.start();

  const dir = resolve(__dirname, '../plugins/.dist');
  const rel = relative(homedir(), resolve(opts.cwd, 'wiki/plugins'));

  await Promise.all(
    plugins.map(async plugin => {
      spinner.text = plugin.name;
      const path = join(dir, `${plugin.name}/plugin.info`);
      await ensureFile(path);
      await fs.writeFile(path, plugin.text, 'utf8');
      await cmd(`mkdir -p wiki/plugins/${plugin.name}`, opts);
    })
  );

  await cmd('cp -r plugins/.dist/* wiki/plugins', opts);

  spinner.text = `wrote ${plugins.length} plugins to "~/${rel}"`;
  spinner.succeed();
};
