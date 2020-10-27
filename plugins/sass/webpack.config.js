const { resolve } = require('path');

module.exports = [
  {
    target: 'web',
    entry: {
      'sass/parser': resolve(__dirname, `./src/parser.ts`)
    }
  },
  {
    target: 'node',
    entry: {
      'sass/sass': resolve(__dirname, `./src/sass.ts`),
      'sass/hook': resolve(__dirname, './src/hook.ts')
    },
    node: {
      __dirname: 'mock'
    },
    externals: [
      /crypto/,
      ({ context, request }, done) =>
        /^(\$:\/)/i.test(request) ? done(null, 'commonjs ' + request) : done()
    ]
  }
];
