/*
*
* @author :: Jyotirmay Senapati
* @Date :: 03rd March, 2018
*/
//
// # SimpleServer
//
// A simple server using http and express.
//
var http = require('http');

var app = require('./app.js');

var server = http.createServer(app);

server.listen(process.env.PORT || 3001, process.env.IP || "localhost", function () {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
