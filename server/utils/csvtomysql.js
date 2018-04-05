
let Tables =  require('tables');
let config = require('../config');
let mysql = config.mysql;


let csvToMysql = {
    import_: function (filePath, table) {
        return new Promise((resolve, reject) => {
            try {
                let tbl = new Tables({
                    input: filePath,
                    inputType: "csv",
                    db: "mysql://" + mysql.user + ":" + mysql.password + "@" + mysql.host + ":" + mysql.port +
                    "/" + mysql.database,
                    tableName: table,
                    dateFormat: ["MM/DD/YYYY", "M/D/YYYY"],
                    datetimeFormat: ["MM/DD/YYYY HH:mm:ss a", "M/D/YYYY HH:mm:ss a"]
                });

                //TODO: Remove timeout with proper setup for promise handling(resolving).
                setTimeout(function () {
                    resolve(table);
                }, 60000);

            } catch(err){
                reject(err);
            }
        });
    }
}

module.exports = csvToMysql;