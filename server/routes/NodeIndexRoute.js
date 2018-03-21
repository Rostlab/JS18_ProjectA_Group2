/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */

const express = require('express');
const nlpService = require("../services/NlpService");
const dataService = require("../services/DataService");
const router = express.Router();

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
