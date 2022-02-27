/**
 * given a string of TiddlyWiki-style key-value pairs, return a POJO.
 */
function parse(str) {
  return str
    .split('\n')
    .map(l => l.split(': '))
    .reduce(
      (a, [k, v]) => ({
        ...a,
        [k]: v
      }),
      {}
    );
}

/**
 * Serialize a POJO into TiddlyWiki's metadata format.
 */
function stringify(o) {
  return Object.entries(o)
    .map(e => e.join(': '))
    .join('\n');
}

/**
 * Given a JS date, serialize it into a format TiddlyWiki understands, which is
 * a little strange.
 */
function timestampFor(date) {
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  ]
    .map(n => n.toString())
    .map(n => n.padStart(2, '0'))
    .join('');
}

module.exports = { parse, stringify, timestampFor };
