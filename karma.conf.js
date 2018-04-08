// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            'karma-jasmine',
            'karma-firefox-launcher',
            'karma-jasmine-html-reporter',
            'karma-coverage-istanbul-reporter',
            '@angular/cli/plugins/karma',
            'karma-babel-preprocessor'
        ],
        client:{
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            reports: [ 'html', 'lcovonly' ],
            fixWebpackSourcePaths: true
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['FirefoxHeadless'],
        /*customLaunchers: {
         Chrome_travis_ci: {
         base: 'Chrome',
         flags: ['--no-sandbox']
         }
         },*/
        singleRun: true,
        preprocessors: {
            'UI/**/*.ts': ['babel'],
            'UI/**/*.js': ['babel'],
            'server/**/*.js': ['babel']
        },
        babelPreprocessor: {
            options: {
                presets: ['env'],
                sourceMap: 'inline'
            }
        }
    };

    /*if (process.env.TRAVIS) {
     configuration.browsers = ['Chrome_travis_ci'];
     }*/

    config.set(configuration);
};