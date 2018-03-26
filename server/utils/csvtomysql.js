var Tables =  require('tables');
var config = require('../config');
var mysql = config.mysql;
var csvToMysql = {
    import: function(filePath, table){
        var table = new Tables({
            input: filePath,
            inputType: "csv",
            db: "mysql://" + mysql.user + ":" +  mysql.password + "@" + mysql.host + ":" + mysql.port + "/" + mysql.database,
            tableName: table
        });
    }
}

module.exports = csvToMysql;