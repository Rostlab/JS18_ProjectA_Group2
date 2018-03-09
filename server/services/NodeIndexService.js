/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

loadCSV = require("../utils/dataLoader");

console.log('in NodeIndexService');

var NodeIndexService = {

	sayHi: function (next) {
        next(null, "Welcome to iGraph");
    },
    loadCSV: function (next){
        data = loadCSV("server/data/core_dataset.csv");
        if (data){
            next(null, data);
        } else {
            next("Data Fetching Error", "");
        }
    }
}

module.exports = NodeIndexService;