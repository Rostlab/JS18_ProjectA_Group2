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
router.get('/', function (req, res, next) {
  indexService.sayHi(function (err, data) {

    if (err) {
      res.send(err);
      return;
    } else {
      res.send(data);
      return;
    }
  });
});

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

<<<<<<< HEAD
router.post('/nlptodata', function (req, res, next) {
  console.log(req.query);
  indexService.nlp(req.query, function (err, data) {
    
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(data);
        return;
      }
    })
=======
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
>>>>>>> bec403cc243fe98a0d6b94e20f59ac80e2a0bcc4
});

router.get('/columns', function (req, res, next) {
  console.log(req.query.dataset);
  indexService.getColumns(req.query.dataset, function (err, data) {
    
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(data);
        return;
      }
    })
});
<<<<<<< HEAD

// optinal feature to implement, if time permits.
/*router.post('/upload', function (req, res, next) {
  console.log(req.query);
  indexService.upload(req.query, function (err, data) {
    
      if (err) {
        res.send(err);
        return;
      } else {
        res.send(data);
        return;
      }
    })
});*/
module.exports = router;
=======
module.exports = router;
>>>>>>> bec403cc243fe98a0d6b94e20f59ac80e2a0bcc4
