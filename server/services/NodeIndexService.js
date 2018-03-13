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
