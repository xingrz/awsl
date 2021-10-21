const { resolve, join } = require('path');
const { readFileSync } = require('fs');
const { BannerPlugin, CleanPlugin } = require('webpack');
const CreateFilePlugin = require('create-file-webpack');

const pkg = require('./package.json');

const META = readFileSync(join(__dirname, 'meta.in.js'), 'utf-8')
  .replace('{{version}}', pkg.version);

module.exports = {
  mode: 'none',
  entry: './src/main.ts',
  plugins: [
    new CleanPlugin(),
    new BannerPlugin({ banner: META, raw: true }),
    new CreateFilePlugin({
      path: resolve(__dirname, 'dist'),
      fileName: 'awsl.meta.js',
      content: META,
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
  },
};
