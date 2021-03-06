const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/main.ts',
        app: './src/script/index.tsx'
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
        },{
            test: /\.scss$/,
            loader: ['style-loader', 'css-loader?modules&localIdentName=[name]--[local]--[hash:base64:5]', 'sass-loader']
        }
        ]
    },
    target: 'electron-main',
    node: {
        __dirname: false
    },
}