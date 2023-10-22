const webpack = require('webpack')
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || "development",
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: {
        index: "./src/index.js",
        // another: "./src/another-module.js"
    },
    // build: {
    //     assetsPublicPath: '/public/',
    // },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/", // 수정: publicPath를 '/'로 설정
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
        new CopyWebpackPlugin({
            patterns: [
              { from: 'public', to: 'public' },
            ],
          }),
        // new CopyPlugin({
        //     patterns: [
        //         // { from: 'src/lib', to: 'lib' },
        //     ],
        // }),
    ],
    // devServer: {
    //     contentBase: './public', // 정적 파일이 위치한 경로
    //     // open: true, // 서버 실행 시 브라우저 자동 열기
    // },
    module: {
        rules: [
            // css
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
            {
              test: /\.(png|svg|jpg|jpeg|gif)$/i,
              type: "asset/resource",
            },
        ],
    }
};