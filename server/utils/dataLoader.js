
var fs = require('fs');
var csvr = require("csv-reader");
var AutoDetectDecoderStream = require('autodetect-decoder-stream');
const csv=require('csvtojson')

loadCSV = function(filepath, next) {
        const csvFilePath=filepath;
        var jsondata = [];
        csv()
        .fromFile(csvFilePath)
        .on('json',(jsonObj)=>{
            //console.log(jsonObj);
            // combine csv header row and csv line to a json object
            // jsonObj.a ==> 1 or 4
            jsondata.push(jsonObj);
            //console.log(jsondata);
        })
        .on('done',(error)=>{
            console.log('end')
            return jsondata;
        })

    

}
module.exports = loadCSV;