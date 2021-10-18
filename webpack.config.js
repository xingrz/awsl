const { resolve, join } = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin, CleanPlugin } = require('webpack');

const pkg = require('./package.json');

const META = readFileSync(join(__dirname, 'meta.in.js'), 'utf-8')
  .replace('{{version}}', pkg.version);

module.exports = {
  mode: 'none',
  entry: {
    user: './src/user.ts',
    meta: './src/meta.ts',
  },
  plugins: [
    new CleanPlugin(),
    new BannerPlugin({ banner: META, raw: true }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'awsl.[name].js',
    path: resolve(__dirname, 'dist'),
  },
};
