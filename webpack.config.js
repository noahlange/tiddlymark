const TerserPlugin = require('terser-webpack-plugin');
const { readdirSync: readdir } = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const babel = require('./babel.config');

const isProduction = process.env.NODE_ENV === 'production';

const terser = new TerserPlugin({
  terserOptions: {
    keep_classnames: true,
    keep_fnames: true
  }
});

const config = {
  mode: process.env.NODE_ENV || 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [{ loader: 'url-loader', options: { limit: 8192 } }]
      },
      {
        test: /\.ttf$/i,
        use: [{ loader: 'url-loader' }]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            ...babel,
            plugins: [
              ...babel.plugins,
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: true,
                  regenerator: false,
                  useESModules: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: isProduction ? [terser] : []
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: `${__dirname}/plugins/.build`,
    publicPath: '/'
  },
  externals: [
    ({ request }, done) =>
      /^(\$:\/|gray-matter)/i.test(request)
        ? done(null, 'commonjs ' + request)
        : done()
  ],
  plugins: [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })],
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json']
  }
};

const targets = readdir('./plugins')
  .filter(d => !d.startsWith('.'))
  .map(plugin => require(`./plugins/${plugin}/webpack.config.js`))
  .reduce((a, b) => a.concat(b), [])
  .reduce((a, b) => ({ ...a, [b.target]: (a[b.target] || []).concat(b) }), {});

module.exports = Object.values(targets).map(plugins =>
  merge(config, ...plugins)
);
