let Tables = require('tables');
let config = require('../config');
let mysql = config.mysql;


let csvToMysql = {
    import_: function (filePath, table) {
        return new Promise((resolve, reject) => {
            try {
                Tables.prototype.done = function (error, message) {
                    if (error) {
                        reject(error);
                    } else {
                        // To allow last set of data dump to complete.
                        setTimeout(function () {
                            resolve(message);
                        }, 6000);
                    }
                }

                let tbl = new Tables({
                    input: filePath,
                    db: "mysql://" + mysql.user + ":" + mysql.password + "@" + mysql.host + ":" + mysql.port +
                    "/" + mysql.database,
                    tableName: table,
                    dateFormat: ["MM/DD/YYYY", "M/D/YYYY"],
                    datetimeFormat: ["MM/DD/YYYY HH:mm:ss a", "M/D/YYYY HH:mm:ss a"]
                });
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = csvToMysql;