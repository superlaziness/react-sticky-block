const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin("style.css");
const dedupePlugin = new webpack.optimize.DedupePlugin();

module.exports = {
  entry: ['./demo/index'],
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'app.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader?sass-loader'),
      }
    ],
  },
  plugins: [extractCSS, dedupePlugin],
};