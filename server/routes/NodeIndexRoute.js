/**
*@author :: Jyotirmay
*@Date :: 03rd March, 2018
*/

var express = require('express');
var indexService = require("../services/NodeIndexService")
var router = express.Router();
var qs = require('querystring');
var multer = require('multer');
var path = require('path');
const crypto = require('crypto');

var DIR = "./server/data/";
var storage = multer.diskStorage({
  destination: DIR,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});



var upload = multer({storage: storage}).single('fileItem');

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

router.get('/nlptodata', function (req, res, next) {
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
});

router.get('/columns', function (req, res, next) {
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

// optinal feature to implement, if time permits.
router.post('/upload', function (req, res, next) {
  var path = "";

  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    } else {
      res.send("File upload complete " + req.file.path);
      return;
    }
  })
});

module.exports = router;
