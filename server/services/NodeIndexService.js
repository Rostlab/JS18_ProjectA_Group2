/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

utils = require("../utils/nlptodata_mysql");
var rp = require('request-promise');
var config = require('../config');

console.log('in NodeIndexService');

var NodeIndexService = {

	sayHi: function (next) {
        next(null, "Welcome to iGraph");
    },

    nlp: function(query, next){

        var propertiesObject = { q:query.userquery, project: config.nlp_project, model: config.nlp_model };
        rp({url: config.nlp_server+'/parse', qs: propertiesObject}).then(function(res){
            //var promise = utils.nlptodata(JSON.parse(res));    
            var promise = utils.nlptodata_mysql(JSON.parse(res), query.dataset);  
            promise.then(function(success){
                next(null, success);
            }, function(err){
                next(err);
            });
        });
    },

    getColumns: function(dataset, next){
        var promise = utils.getColumns(dataset);
        promise.then(function(success){
            next(null, success);
        }, function(err){
            next(err);
        });
    },

    importCsvToMysql: function(filePath, tableName, next){
        var promise = utils.importCsvToMysql(filePath, tableName);
        promise.then(function(success){
            next(null, success);
        }, function(err){
            next(err);
        });
    }
   /* // Implement if time permits.
    upload: function(query, next){
        var promise = utils.upload(query.uploadeddoc);
        promise.then(function(success){
            next(null, success);
        }, function(err){
            next(err);
        });
    }
    */
}

module.exports = NodeIndexService;
