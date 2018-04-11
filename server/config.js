var LoggerModule = require('./logger.js');
var logger = LoggerModule.logger;
var log = LoggerModule.log;

let config = (function() {
    // Just to ensure if file structure for logs are ready before use.
    log.setUp();

    return new function() {

        this.nlp_server = 'http://localhost:5000',
        this.nlp_project = 'igraph_nlp',
        this.nlp_model_sentence = 'model_20180407-125051',
        this.nlp_model_ops = 'model_20180407-234649',
        this.config_table = 'config',

        this.mysql = {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '3306',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'igraph'
        },

        this.logger = logger,

        this.uniqueness_threshold = 0.1,

        this.knex = {
            client: 'mysql',
            connection: this.mysql,
            pool: { min: 0, max: 7 },
            acquireConnectionTimeout: 5000,
            fetchAsString: [ 'number', 'clob', 'blob' ]
        }
    }
})();

module.exports = config;
