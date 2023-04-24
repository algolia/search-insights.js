import path from 'path';

import dotenv from 'dotenv';
import HtmlReplaceWebpackPlugin from 'html-replace-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const { NODE_ENV, APP_ID, API_KEY, INDEX_NAME } = process.env;
if ([NODE_ENV, APP_ID, API_KEY, INDEX_NAME].some((v) => !v)) {
  /* eslint-disable no-console, no-process-exit */
  console.error(`The following environment variables are required:`);
  console.error(`  > NODE_ENV, APP_ID, API_KEY, INDEX_NAME`);
  console.error(`You can either specify them when running command,`);
  console.error(`or create .env file to store them locally.`);
  console.error('');
  process.exit(1);
  /* eslint-enable no-console, no-process-exit */
}
const SCRIPT_SRC =
  NODE_ENV === 'production'
    ? 'https://cdn.jsdelivr.net/npm/search-insights@1.0.0/dist/search-insights.min.js'
    : '/search-insights.min.js';

const replaceHTMLPlugin = new HtmlReplaceWebpackPlugin([
  {
    pattern: '@@SCRIPT_SRC',
    replacement: SCRIPT_SRC,
  },
  {
    pattern: '@@API_KEY',
    replacement: API_KEY,
  },
  {
    pattern: '@@APP_ID',
    replacement: APP_ID,
  },
  {
    pattern: '@@INDEX_NAME',
    replacement: INDEX_NAME,
  },
]);

const PLUGINS = [
  replaceHTMLPlugin,
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
      APP_ID: JSON.stringify(APP_ID),
      API_KEY: JSON.stringify(API_KEY),
      INDEX_NAME: JSON.stringify(INDEX_NAME),
      SCRIPT_SRC: JSON.stringify(SCRIPT_SRC),
    },
  }),
  new MiniCssExtractPlugin({
    filename: `[name].css`,
  }),
  new HtmlWebpackPlugin({
    template: path.join(
      process.cwd(),
      'examples/instantsearch/instantsearch.html'
    ),
    filename: 'instantsearch.html',
    chunks: ['instantsearch'],
  }),
  new webpack.HotModuleReplacementPlugin(),
];

const exampleEntries = {
  instantsearch: path.join(
    process.cwd(),
    'examples/instantsearch/instantsearchExample.js'
  ),
};

export default {
  mode: NODE_ENV ?? 'production',
  entry: exampleEntries,
  output: {
    path: path.resolve(process.cwd(), 'tests/production'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash].chunk.js' : '[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.(js)$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
          },
          {
            loader: 'image-webpack-loader',
            options: {
              progressive: true,
              optimizationLevel: 7,
              interlaced: false,
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
    ],
  },

  target: 'web',
  context: path.resolve(process.cwd()),

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  plugins: PLUGINS,

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: NODE_ENV === 'development' ? 8080 : 3001,
  },
};
