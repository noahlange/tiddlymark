const TerserPlugin = require('terser-webpack-plugin');
const { readdirSync: readdir } = require('fs');
const { optimize } = require('webpack');
const { smart } = require('webpack-merge');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  mode: process.env.NODE_ENV || 'none',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
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
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: true,
                    browsers: [
                      'last 2 Firefox versions',
                      'last 2 Chrome versions'
                    ]
                  }
                }
              ],
              '@babel/preset-typescript'
            ],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  absoluteRuntime: false,
                  corejs: false,
                  helpers: true,
                  regenerator: false,
                  useESModules: true
                }
              ],
              '@babel/plugin-syntax-dynamic-import',
              ['@babel/plugin-proposal-class-properties', { loose: true }]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimizer: isProduction
      ? [
          new TerserPlugin({
            terserOptions: {
              keep_classnames: true,
              keep_fnames: true
            }
          })
        ]
      : []
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: `${__dirname}/plugins/.build`
  },
  externals: (ctx, req, cb) =>
    /^(\$:\/|gray-matter)/i.test(req) ? cb(null, 'commonjs ' + req) : cb(),
  plugins: [
    new optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
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
  smart(config, ...plugins)
);
