import { logger, log }  from './logger';


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
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '',
            database: 'igraph'
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