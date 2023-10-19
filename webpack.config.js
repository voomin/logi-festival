const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    // entry: "./script.js",
    // module: "commonjs",
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: {
        index: "./src/index.js",
        // another: "./src/another-module.js"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'key': path.resolve(__dirname, './key.js'),
      },
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: './src/index.html'
        }),
        // new CopyPlugin({
        //     patterns: [
        //         // { from: 'src/lib', to: 'lib' },
        //     ],
        // }),
    ],
};