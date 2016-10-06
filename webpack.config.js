/*
 * @Author: zhouningyi
 * @Date:   2016-10-01 14:18:17
 * @Last Modified by:   zhouningyi
 * @Last Modified time: 2016-10-01 21:18:40
 */
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ip = require('ip');
const SftpWebpackPlugin = require('sftp-webpack-plugin');

const PROCESS_PATH = process.cwd(); // Project Path
const CONFIG_PATH = (() => {
  const projectConfig = path.join(PROCESS_PATH, '.config.js');
  return fs.existsSync(projectConfig) ? projectConfig : './.config.js';
})();
const CONFIG = require(CONFIG_PATH);
const SRC = CONFIG.src || path.join(PROCESS_PATH, './src');
const HTML_TEMPLATE_SRC = CONFIG.html || path.join(SRC, 'index.html');
const SFTP_CONF = CONFIG.sftp;


/*
const SFTP_CONFIG = {
  on: process.env.SFTP || false, // default false
  conf: {
    host: 'example.com',
    port: '22', // default
    username: 'username',
    password: 'password',
    from: '/path/to/localDistPath',
    to: '/path/to/serverPath',
  }
};
*/


module.exports = {
  entry: [
    require.resolve('babel-polyfill'),
    path.resolve(SRC, 'index.js')
  ],
  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
    fallback: path.join(__dirname, 'node_modules')
  },
  output: {
    path: path.join(PROCESS_PATH, 'dist'),
    filename: './bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      CONTAINERS: path.join(SRC, 'containers'),
      COMPONENTS: path.join(SRC, 'components'),
      ACTIONS: path.join(SRC, 'actions'),
      REDUCERS: path.join(SRC, 'reducers'),
      STORE: path.join(SRC, 'store'),
      CONFIG: path.join(SRC, 'conf'),
      //
      ROUTES: path.join(SRC, 'routes'),
      SERVICES: path.join(SRC, 'services'),
      UTILS: path.join(SRC, 'utils'),
      HOC: path.join(SRC, 'utils/HoC'),
      MIXIN: path.join(SRC, 'utils/mixins'),
      VIEWS: path.join(SRC, 'views'),
    },
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: [
          'es2015',
          'react',
          'stage-0',
          'stage-2',
        ].map(e => `babel-preset-${e}`).map(require.resolve),
      }
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss!sass'
    }, {
      test: /\.less$/,
      loader: 'style!css!postcss!less'
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss'
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url?limit=25000&name=[path][name].[ext]?[hash]'
    }, {
      test: /\.(eot|woff|ttf|svg)$/,
      loader: 'url?limit=30000&name=[path][name]-[hash].[ext]'
    }],
  },
  postcss: function() {
    return [autoprefixer, precss];
  },
  plugins: process.env.NODE_ENV === 'production' ? SFTP_CONF ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE_SRC,
      chunkSortMode: 'none'
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
    new SftpWebpackPlugin(SFTP_CONF)
  ] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE_SRC,
      chunkSortMode: 'none'
    }),
    new ExtractTextPlugin('[name].[contenthash].css'),
  ] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlWebpackPlugin({
      template: HTML_TEMPLATE_SRC,
      chunkSortMode: 'none'
    }),
    new OpenBrowserPlugin({
      url: `http://${ip.address()}:${process.env.PORT || 8080}`
    })
  ],
  devtool: process.env.NODE_ENV === 'production' ? '' : '#inline-source-map'
};
