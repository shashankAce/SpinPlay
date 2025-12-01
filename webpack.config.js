const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    entry: './client/src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        // Make source maps point to readable absolute paths in DevTools:
        devtoolModuleFilenameTemplate: info =>
            `webpack:///${path.relative(__dirname, info.absoluteResourcePath).replace(/\\/g, '/')}`
    },

    // Use a dev-friendly source map. Options:
    // - 'eval-source-map' : fastest rebuilds, good for breakpoints
    // - 'inline-source-map' : robust, inlines the map into bundle
    // - 'source-map' : external map files (slower but production-like)
    devtool: 'eval-source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        // transpileOnly: true is OK for fast dev but disables type checking.
                        // If you set transpileOnly: true, consider running fork-ts-checker plugin to keep type-checking.
                        transpileOnly: false
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: './client/assets', to: 'assets' },
                { from: './client/css/style.css', to: 'styles.css' }
            ]
        })
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, 'client'),
            publicPath: '/',
        },
        devMiddleware: {
            publicPath: '/',
            writeToDisk: false
        },
        hot: true,
        port: 3001,
        historyApiFallback: true,
    }
};
