/** eslint-env node */

const ora = require('ora');

const read = require('./read');
const make = require('./make');
const dist = require('./dist');

const tasks = [read, make, dist];

(function build() {
  const spinner = ora().start('building plugins');
  return tasks.reduce(async (a, b) => b(spinner, await a), Promise.resolve());
})();
