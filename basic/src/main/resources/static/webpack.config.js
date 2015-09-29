var path = require('path');
var BowerWebpackPlugin = require("bower-webpack-plugin");

var bower_dir = __dirname + '/bower_components';

module.exports = {
    entry: './app.js',
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    resolve: {
        alias: {
            'rest/interceptor/defaultRequest': bower_dir + '/rest/interceptor/defaultRequest.js',
            'rest/interceptor/mime': bower_dir + '/rest/interceptor/mime.js',
            'rest/interceptor/errorCode': bower_dir + '/rest/interceptor/errorCode.js',
            'rest/mime/registry': bower_dir + '/rest/mime/registry.js',
            'rest/mime/type/application/hal': bower_dir + '/rest/mime/type/application/hal.js',
            'rest/interceptor': bower_dir + '/rest/interceptor.js'
        }
    },
    output: {
        path: __dirname,
        filename: './built/bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [new BowerWebpackPlugin()]
};