/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */

const express = require('express');
const nlpService = require("../services/NlpService");
const dataService = require("../services/DataService");
var router = express.Router();
var path = require('path');


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


router.post('/upload', function (req, res) {
  dataService.upload(req, res, function (err) {
    if (err) {
      console.log(err.toString());
      res.send({"Error" : err.toString()});
      return;
    } else {
      var filePath = req.file.path;      
      //Take file name as a table name
      var tableName = path.basename(filePath, path.extname(filePath)).toLowerCase();

      dataService.importCsvToMysql(filePath, tableName).then(tableName => {
              res.status(202).send({"fileName" : tableName});
              return;
          }, err => {
              res.send(err);
              return;
      });
    // Not waiting for dataset to get uploaded to mysql database. Sent a request above and assuming it will get
    // uploaded properly once started.
    //res.status(202).send({"fileName" : tableName});
    //return;
    }
  });
});


router.get('/getTables', function(req, res){
  dataService.getTables().then(tables => {
    res.status(202).send({"tables" : tables});
    return;
  }).catch(err => {
    console.log("Err");
    res.send(err);
    return;
  });
});


// Sample test endpoint to debug newly developed functionality with mocked data from REST client.
router.get('/func_test', function(req, res){
    dataService.test(function(err, data) {
        if(err) {
            res.send(err)
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
