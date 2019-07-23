const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
require('dotenv').config();

const isProd = process.env.NODE_ENV === "production";
const { NODE_ENV, APP_ID, API_KEY, INDEX_NAME } = process.env;
if ([NODE_ENV, APP_ID, API_KEY, INDEX_NAME].some(v => !Boolean(v))) {
  console.error(`The following environment variables are required:`);
  console.error(`  > NODE_ENV, APP_ID, API_KEY, INDEX_NAME`);
  console.error(`You can either specify them when running command,`);
  console.error(`or create .env file to store them locally.`);
  console.error('')
  process.exit(1);
}
const SCRIPT_SRC = NODE_ENV === 'production' ? 'https://cdn.jsdelivr.net/npm/search-insights@1.0.0/dist/search-insights.min.js' : '/search-insights.min.js';

const replaceHTMLPlugin = new HtmlReplaceWebpackPlugin([
  {
    pattern: '@@SCRIPT_SRC',
    replacement: SCRIPT_SRC
  },
  {
    pattern: '@@API_KEY',
    replacement: API_KEY
  },
  {
    pattern: '@@APP_ID',
    replacement: APP_ID
  },
  {
    pattern: '@@INDEX_NAME',
    replacement: INDEX_NAME
  },
]);

const PLUGINS = [
  new ExtractTextPlugin('[name].[hash].css'),
  replaceHTMLPlugin,
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
      APP_ID: JSON.stringify(APP_ID),
      API_KEY: JSON.stringify(API_KEY),
      INDEX_NAME: JSON.stringify(INDEX_NAME),
      SCRIPT_SRC: JSON.stringify(SCRIPT_SRC)
    },
  }),
  new ExtractTextPlugin('[name].css'),
  new HtmlWebpackPlugin({
    template: path.join(process.cwd(), 'examples/instantsearch/instantsearch.html'),
    filename: "instantsearch.html",
    chunks: ['instantsearch']
  }),
  new webpack.HotModuleReplacementPlugin(),
];

const exampleEntries = {
  instantsearch: path.join(process.cwd(), 'examples/instantsearch/instantsearchExample.js'),
}

module.exports = {
  entry: exampleEntries,
  output: {
    path: path.resolve(process.cwd(), 'tests/production'),
    publicPath: '/',
    filename: isProd ? '[name].js' : '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash].chunk.js' : '[name].chunk.js',
  },

  module: {
    rules: [
    {
      test: /\.ts$/,
      use: 'ts-loader'
    },
    {
      test: /\.(js)$/,
      exclude: [
        /node_modules/
      ],
      loader: 'babel-loader',
      query: {
        presets: ['env']
      }
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?minimize', 'sass-loader']
      })
    }, {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: 'file-loader'
    }, {
      test: /\.(jpg|png|gif)$/,
      use: [{
        loader: 'file-loader'
      }, {
        loader: 'image-webpack-loader',
        options: {
          progressive: true,
          optimizationLevel: 7,
          interlaced: false,
          pngquant: {
            quality: "65-90",
            speed: 4
          }
        }
      }],
    }, {
      test: /\.html$/,
      loader: 'html-loader',
      options: {
        interpolate: true
      }
    }, {
      test: /\.json$/,
      use: 'json-loader',
    }]
  },

  target: 'web',
  context: path.resolve(process.cwd()),

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    modules: ['.', 'node_modules', 'styles/']
  },

  plugins: PLUGINS,

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: NODE_ENV === 'development' ? 8080 : 3001
  },
}
