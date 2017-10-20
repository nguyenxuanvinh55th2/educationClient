const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const path = require('path');

const env = { dev: process.env.NODE_ENV };
const devServerConfig = {
    hot: true,
    contentBase: __dirname,
    historyApiFallback: { disableDotRule: true }, // Need historyApiFallback to be able to refresh on dynamic route
    stats: { colors: true } // Pretty colors in console
};

const app = new WebpackDevServer(webpack(webpackConfig), devServerConfig);
