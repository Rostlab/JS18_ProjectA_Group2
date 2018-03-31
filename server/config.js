import { logger, logSetup }  from './logger';


let config = (function() {
    // Just to ensure file structure for logs are ready before use.
    logSetup.logSetUp();

    return {
        nlp_server: 'http://localhost:5000',
            nlp_project: 'igraph_nlp',
        nlp_model: 'model_20180313-225005',

        mysql: {
        host : 'localhost',
            port : '3306',
            user : 'root',
            password : '',
            database : 'igraph'
    },

            logger: logger
    }
})();

module.exports = config;