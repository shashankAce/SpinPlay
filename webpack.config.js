const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    // mode: "development",
    entry: './client/src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            phaser: path.resolve(__dirname, 'node_modules/phaser/dist/phaser.min.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
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
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
};


