var path = require('path');
var webpack = require('webpack');

module.exports = {
  context:__dirname + '/app',
  entry: [
    'webpack-dev-server/client?http://localhost:4000',
    'webpack/hot/only-dev-server',
    __dirname + '/app/main'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        },
        {
            test: /\.scss$/,
            loader: 'style!css!sass!sass-resources'
        },
        {
            test: /bootstrap\/dist\/js\/umd\//,
            loader: 'imports?jQuery=jquery'
        },
        { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
        { test: /\.(ttf|eot)$/, loader: 'file' }
  ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
         root: 'node_modules/',
   },
};
