var mysql = require('mysql');
var sync = require('sync');


var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    select_db: "igraph"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});
/*
con.query("select * from igraph.core_data limit 10", function (err, result) {
    if (err) throw err;
    out = {"plot": true, "plot_type": "bar", "x": "employee count", "y": 
    "department", "title": "bar chart on number of employees per department", "data":[]};
    result.forEach(function(item, idx){
        //console.log(item.x);
        out.data.push([item.x, item.y]);
    });
    console.log(out);
});*/

var db = {
    connect: function(){
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    },

    query: function(sql){
        var conobj = con;//db.connect.sync();
        
        
       
    },
    //"select count(`Employee Number`) as x, Department as y from igraph.core_data group by Department"
    
    getTables: function(next){
        con.query("SHOW TABLES FROM igraph;", function(error, result, fields){
            if(error) throw error;
            var list = [];
            result.forEach(function(row){
                list.push(row.Tables_in_igraph);
            });
            return next(list);
        });
    }

}

module.exports = db;