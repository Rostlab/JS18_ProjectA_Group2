var Tables =  require('tables');
var config = require('../config');
const byline = require('byline');
var mysql = config.mysql;
var csvToMysql = {
    import: function (filePath, table) {
        return new Promise((resolve, reject) => {
            let stream = new Tables({
                input: filePath,
                inputType: "csv",
                db: "mysql://" + mysql.user + ":" + mysql.password + "@" + mysql.host + ":" + mysql.port + "/" + mysql.database,
                tableName: table,
                done: function(err, msg){
                    console.log(err, msg);
                    if(err){
                        reject(err);
                    } else {

                        resolve(msg);
                    }
                }
            });
            stream.on("end", function(){

            })
        });
    }
}

module.exports = csvToMysql;