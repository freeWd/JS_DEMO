const path = require("path");
const webpack = require('webpack');
const base = require('./webpack.base');
const merge = require('webpack-merge');

const NODE_ENV = process.env.NODE_ENV;

let build;
if (NODE_ENV === 'development') {
  build = require('./webpack.dev.config');
} else {
  build = require('./webpack.prod.config');
}

module.exports = merge(base, build);
