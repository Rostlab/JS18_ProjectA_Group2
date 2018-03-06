/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

console.log('in NodeIndexService');

var NodeIndexService = {
	// Save to blogSchema
	sayHi: function (next) {
        next(null, "Welcome to iGraph");
    }
}

module.exports = NodeIndexService;