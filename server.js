// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');
//
// new WebpackDevServer(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true,
//   historyApiFallback: true
// }).listen(4000, '0.0.0.0', function (err, result) {
//   if (err) {
//     return console.log(err);
//   }
//
//   console.log('Listening at http://localhost:4000/');
// });

/**
 * Webpack Dev Server
 * This file is used to run our local enviroment
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const path = require('path');

// always dev enviroment when running webpack dev server
const env = { dev: process.env.NODE_ENV };

const devServerConfig = {
    hot: true,
    contentBase: __dirname,
    historyApiFallback: { disableDotRule: true }, // Need historyApiFallback to be able to refresh on dynamic route
    stats: { colors: true } // Pretty colors in console
};

const server = new WebpackDevServer(webpack(webpackConfig), devServerConfig);

server.listen(4000, 'localhost');
