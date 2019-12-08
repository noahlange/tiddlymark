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

function stringify(o) {
  return Object.entries(o)
    .map(e => e.join(': '))
    .join('\n');
}

function timestampFor(d) {
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds()
  ]
    .map(n => n.toString())
    .map(n => n.padStart(2, '0'))
    .join('');
}

module.exports = { parse, stringify, timestampFor };
