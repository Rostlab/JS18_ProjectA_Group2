/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

var express = require('express');
var indexService = require("../services/NodeIndexService")
var router = express.Router();
var qs = require('querystring');

console.log('in NodeIndexRoute');

/* GET */
router.get('/test', function (req, res, next) {
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

router.post('/', function (req, res, next) {
  indexService.nlp(req.query.userquery, function (err, data) {
    
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
