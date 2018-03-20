// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
            require('karma-webpack'),
            require('karma-babel-preprocessor'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular/cli/plugins/karma'),
            require('babel-preset-es2015'),
            require('babel-loader'),
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: true,
        browsers: ['PhantomJS'],
        /*customLaunchers: {
         Chrome_travis_ci: {
         base: 'Chrome',
         flags: ['--no-sandbox']
         }
         },*/
        singleRun: true,
        babelPreprocessor: {
            options: {
                "presets": ["es2015"]
            }
        }
    };

    /*if (process.env.TRAVIS) {
     configuration.browsers = ['Chrome_travis_ci'];
     }*/
    config.set(configuration);
};
