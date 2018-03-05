var path = require('path');
module.exports = () => {
    return {
        entry: {
            main: './src/main.ts'
        },
        output: {
            path: './dist',
            filename: 'index.js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.html']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loaders: [
                        'awesome-typescript-loader',
                        'angular2-template-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    loader:"file-loader",
                    query:{
                    name:'[name].[ext]',
                    outputPath:'images/'
                    }
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                    loader: "url-loader",
                    query:{
                    limit:'10000',
                    name:'[name].[ext]',
                    outputPath:'fonts/'
                    }
                },
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', "style-loader","css-loader"]
                }
            ]
        },
        devtool: 'inline-source-map',
        watch: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
          }
    };
};