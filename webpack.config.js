'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const WATCH = process.env.WATCH || false;
const webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var precss = require('precss');
var autoprefixer = require('autoprefixer');

var pages = ['index'];

module.exports = {
    entry: {
        app: './src/index'
    },
    output: {
        path: __dirname + '/public',
        // publicPath: '/',
        filename: '[name].js'
    },

    watch: NODE_ENV == 'development',

    watchOptions: {
        aggregateTimeout: 100
    },

    devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null,

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js']
    },

    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js', '.css']
    },

    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules|vendor/ }
        ],
        loaders: [{
            test: /\.js$/,
            // exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                cacheDirectory: true
            }
        }, {
            test: /\.pug$/,
            loader: 'pug-loader'
        }, {
            test: /\.css$/,
            // exclude: /node_modules/,
            loader: ExtractTextPlugin.extract(
                'style-loader',
                'css-loader!postcss-loader'
            )
        }, {
            test: /\.(otf|eot|ttf|woff)/,
            loader: 'url-loader?limit=8192?[hash]'
        }, {
            test: /\.(png|jpg|jpeg|svg)$/,
            loader: 'file?name=img/[name].[ext]'
        }, {
            test: /\.json$/,
            loader: 'file-loader'
        }]

    },
    plugins: [
        new ExtractTextPlugin('styles.css', { allChunks: true }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    eslint: {
        fix: true
    },
    postcss: function() {
        return [precss, autoprefixer];
    }
};

for (var i = 0; i < pages.length; i++) {
    module.exports.plugins.push(new HtmlPlugin({
        title: pages[i],
        chunks: ['app'],
        filename: pages[i] + '.html',
        template: __dirname + '/src/pages/' + pages[i] + '/' + pages[i] + '.pug'
    }));
}

if (WATCH) {
    module.exports.plugins.unshift(new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        server: { baseDir: ['public'] }
    }));
}

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                // don't show unreachable variables etc
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}
