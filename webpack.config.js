const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
        ]
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
            inject: 'body',
        }),
    ],
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: "/node_modules",
            use: ['babel-loader'],
            include: path.join(__dirname, "app")
          },
          { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        //   {
        //     test: /\.(ttf|eot|svg|gif|png|jpg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        //     loader: 'file-loader'
        //   }
        ],
    },
    resolve: {
        alias: {
            "ag-grid-root" : __dirname + "/node_modules/ag-grid",
            "quill-root" : __dirname + "/node_modules/quill",
            "react-grid-layout-root" : __dirname + "/node_modules/react-grid-layout",
            "react-resizable-root" : __dirname + "/node_modules/react-resizable",
            "rc-slider-root" : __dirname + "/node_modules/rc-slider",
            // "patternfly-root": __dirname + "/node_modules/patternfly/",
        }
    },
};
module.exports = config;
