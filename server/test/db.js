var mysql = require('mysql');
const config = require('../config');

var con = mysql.createConnection(config.mysql);
con.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
});

let dbFunctions = {
    deleteTable: function(tableName){    
        con.query('DROP TABLE IF EXISTS igraph.' + tableName, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
        });     
    }
}

module.exports = dbFunctions;