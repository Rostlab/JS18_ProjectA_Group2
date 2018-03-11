/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

utils = require("../utils/nlptodata");
const DF = require('data-forge');
var rp = require('request-promise');

console.log('in NodeIndexService');

var NodeIndexService = {

	sayHi: function (next) {
        next(null, "Welcome to iGraph");
    },
    loadCSV: function (next){
        const csvFilePath="server/data/core_dataset.csv";
        var df = DF
        .readFileSync(csvFilePath)
        .parseCSV();
        console.log(df);

        next(null, df);
    },
    nlp: function(userquery, next){
        var propertiesObject = { q:userquery, model:'sample_igraph' };

        rp({url:'http://localhost:5000/parse', qs:propertiesObject}).then(function(res){
            var promise = utils(JSON.parse(res));    
            promise.then(function(succ){
                next(null, succ);
            }, function(err){
                next(err);
            });
        });
    }
}

module.exports = NodeIndexService;