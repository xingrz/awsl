const { resolve, join } = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin } = require('webpack');
const CreateFilePlugin = require('create-file-webpack');

const { version } = require('./package.json');

const META = readFileSync(join(__dirname, 'assets', 'meta.in.js'), 'utf-8')
  .replace('{{version}}', version);

const MANIFEST = readFileSync(join(__dirname, 'assets', 'manifest.in.json'), 'utf-8')
  .replace('{{version}}', version);

module.exports = {
  mode: 'none',
  entry: [
    './src/v6.ts',
  ],
  plugins: [
    new BannerPlugin({ banner: META, raw: true }),
    new CreateFilePlugin({
      path: resolve(__dirname, 'dist'),
      fileName: 'awsl.meta.js',
      content: META,
    }),
    new CreateFilePlugin({
      path: resolve(__dirname, 'dist'),
      fileName: 'manifest.json',
      content: MANIFEST,
    }),
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
    filename: 'awsl.user.js',
    path: resolve(__dirname, 'dist'),
    clean: true,
  },
};
