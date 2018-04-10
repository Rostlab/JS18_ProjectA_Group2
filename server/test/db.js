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
        return new Promise((done) => {
            con.query('DROP TABLE IF EXISTS igraph.' + tableName, function (err, result) {
                if (err) {
                    console.log(err);
                    reject();
                }
            });     
            con.query('DELETE FROM config WHERE tablename = \'' + tableName + '\';', function (err, result) {
                if (err) {
                    console.log(err);
                    reject();
                    return;
                }
            });   
            done();
        });
    }
}

module.exports = dbFunctions;