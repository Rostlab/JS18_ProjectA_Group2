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
var fs = require('fs');

var DIR = "./server/data/";
var storage = multer.diskStorage({
  destination: DIR,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);
      fs.exists(DIR + file.originalname, function(exists) {
        var fileName;
        if (exists) {
          console.log("exists");
          fileName = Date.now() + '_' + file.originalname;
        } else {
          console.log("does not exists");
          fileName = file.originalname;
        } 
        cb(null, fileName)
    });
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
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    } else {
      var filePath = req.file.path;      
      //Take file name as a table name
      var tableName = path.basename(filePath, path.extname(filePath));
      indexService.importCsvToMysql(filePath, tableName, function(err){        
        if(err){
          console.log(err);
          res.send(err);
          return;
        }
      });
      res.status(202).send({"fileName" : tableName});
      return;
    }
  })
});

module.exports = router;
