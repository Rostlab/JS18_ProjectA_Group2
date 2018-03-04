/*
*
* @author :: Jyotirmay Senapati
* @Date :: 04th March, 2018
*
*/

var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var mongoose = require("mongoose");
var CryptoJS = require("crypto-js");

//var stacktrace = require("stacktrace");

var health = require('express-ping');

// Mongoo DB config File..
//var config = require("./config");

//Creating global AP app
var app = express();

// iGraph apis
var NodeIndexRoute = require('./routes/NodeIndexRoute');
app.use('/api', NodeIndexRoute);

//Conect to DB
/*mongoose.connect(config.mongoUri, function (err) {
  if (!err) {
    log.info("Connected to Database.");
    log.info("*** Welcome to iGraph ***");
  } else {
    log.error(err);
  }
});
*/

var corsOptions = {
  origin: true,
  methods: 'GET,PUT,POST,DELETE',
  maxAge: 1728000
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
