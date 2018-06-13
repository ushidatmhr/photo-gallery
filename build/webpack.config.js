const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/main.ts'
    },
    output: {
        path: path.resolve(__dirname, '../app'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx'],
        modules: ["node_modules"]
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader'
        },
        ]
    },
    target: 'electron-main'
}