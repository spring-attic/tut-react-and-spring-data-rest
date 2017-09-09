const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/main/js/app.js',
  devtool: 'source-map',
  cache: true,
  output: {
    path: __dirname,
    filename: './src/main/resources/static/built/bundle.js'
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],
  module: {
    rules: [
      {
        test: path.join(__dirname, '.'),
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ['es2015', 'react']
          }
        }
      }
    ]
  }
};
