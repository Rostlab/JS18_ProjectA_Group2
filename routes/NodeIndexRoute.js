/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

var express = require('express');
var indexService = require("../services/NodeIndexService")
var router = express.Router();

console.log('in NodeIndexRoute');

/* GET home page. */
router.get('/', function (req, res, next) {
    indexService.sayHi(function (err, data) {
        if (err) {
          res.send(err);
          return;
        } else {
          res.send(data);
          return;
        }
      })
});

module.exports = router;