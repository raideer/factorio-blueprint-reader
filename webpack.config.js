const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/index.js'],
    output: {
        filename: 'factorio-blueprint-reader.js',
        path: path.resolve('dist'),
        library: 'FBR',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: {
                                    uglify: true
                                }
                            }]
                        ]
                    }
                }
            }
        ]
    }
};
