var Tables =  require('tables');

var csvToMysql = {
    import: function(filePath, table){
        var table = new Tables({
            input: filePath,
            inputType: "csv",
            db: "mysql://root:root@localhost:3306/iGraph",
            tableName: table
        });
    }
}

module.exports = csvToMysql;