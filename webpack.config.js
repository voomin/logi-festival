const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    // entry: "./script.js",
    // module: "commonjs",
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