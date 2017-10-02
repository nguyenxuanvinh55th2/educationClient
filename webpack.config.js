const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
var config = {
    context: __dirname + "/app",
    devtool: 'inline-source-map',
    entry: {
        app: __dirname + "/app/main.jsx",
        vendor: [
            'react', 'react-dom', 'react-addons-test-utils', 'react-grid-layout', 'react-router',
            'lodash', 'moment', 'redux', 'asteroid',
            'apollo-client', 'react-apollo', 'graphql-tag', 'react-redux',
            'react-notification-system'
        ],
        utility: [
            'ag-grid', 'ag-grid-enterprise', 'ag-grid-react',
            'quill', 'react-tab-panel', 'react-tabs'
        ],
        meteor: ['meteor-client']
    },
    devServer: {
        hot: true,
        contentBase: __dirname,
        port: 4000,
        historyApiFallback: true
    },
    output: {
        filename: "[name].[hash].js",
        chunkFilename: "[name].[hash].js",
        path: __dirname + "/dist",
        publicPath: '/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.optimize.CommonsChunkPlugin({
          name: ['vendor', 'utility'],
          minChunks: Infinity,
          filename: '[name].[hash].js',
      }),
      new HtmlWebpackPlugin({
          template: path.join(__dirname, './index.html'),
          filename: 'index.html',
          inject: 'body'
      }),
      new ExtractTextPlugin({ // define where to save the file
          filename: 'bundle.css',
          allChunks: true,
          disable: process.env.NODE_ENV !== 'production'
      })
    ],
    module: {
        rules: [
          {
              test: /\.jsx?$/,
              exclude: "/node_modules",
              use: ['babel-loader'],
              include: path.join(__dirname, "app")
          },
          { // regular css files
              test: /\.css$/,
              loader: ExtractTextPlugin.extract({
                  loader: 'css-loader?importLoaders=1',
              }),
          },
          {
              test: /\.scss$/,
              use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  //resolve-url-loader may be chained before sass-loader if necessary
                  use: ['css-loader', 'sass-loader']
              })
          },
          {
              test: /\.(jpe?g|png|gif|svg)$/i,
              loaders: [
                  'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                  'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
              ]
          },
          {
              test: /\.(ttf|eot|svg|gif|png|jpg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
              loader: 'file-loader?cacheDirectory=true',
              options: {
                  name: '[sha512:hash:hex].[ext]'
              }
          }
        ],
    },
    resolve: {
        alias: {
            "ag-grid-root" : __dirname + "/node_modules/ag-grid",
            "quill-root" : __dirname + "/node_modules/quill",
            "react-grid-layout-root" : __dirname + "/node_modules/react-grid-layout",
            "react-resizable-root" : __dirname + "/node_modules/react-resizable",
            "rc-slider-root" : __dirname + "/node_modules/rc-slider",
            "educationServer" : path.resolve(__dirname, '../educationServer/collections')
            // "patternfly-root": __dirname + "/node_modules/patternfly/",
        }
    },
    externals: [
      function resolveMeteor(context, request, callback) {
        var match = request.match(/^meteor\/(.+)$/);
        var pack = match && match[1];
        var locator = pack && 'Package["' + pack + '"]';

        return locator ? callback(null, locator) : callback();
      }
    ],
};
module.exports = config;
