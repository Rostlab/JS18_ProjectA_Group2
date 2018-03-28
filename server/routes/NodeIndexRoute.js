/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */

const express = require('express');
const nlpService = require("../services/NlpService");
const dataService = require("../services/DataService");
const crypto = require('crypto');
var router = express.Router();
var qs = require('querystring');
var multer = require('multer');
var path = require('path');
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

router.get('/test', function (req, res) {
    res.send("Welcome to iGraph");
});

router.get('/plot', function (req, res) {
    console.log(req.query);
    //TODO:Standardize model object for request
    const userQuery = req.query.userquery;
    const dataset = req.query.dataset;
    nlpService.processQuery(userQuery, dataset).then(nlp_response => {
        return dataService.getData(nlp_response);
    }).then(query_response => {
        res.send(query_response)
    }).catch(err => {
        res.send(err);
    });
});

router.get('/columns', function (req, res) {
    console.log('inside columns');
    dataService.getColumns(req.query.dataset).then(columns => {
        res.send(columns)
    }).catch(err => {
        res.send(err);
    });
});

// optinal feature to implement, if time permits.
router.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
      return;
    } else {
      console.log("received file");
      var filePath = req.file.path;      
      //Take file name as a table name
      var tableName = path.basename(filePath, path.extname(filePath));
      dataService.importCsvToMysql(filePath, tableName, function(err){        
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

router.get('/getTables', function(req, res){
  dataService.getTables().then(tables => {
    res.status(202).send({"tables" : tables});
    return;
  }).catch(err => {
    console.log("Err");
    res.send(err);
  });
});

module.exports = router;
