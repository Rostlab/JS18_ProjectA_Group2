
var fs = require('fs');
var csvr = require("csv-reader");
var AutoDetectDecoderStream = require('autodetect-decoder-stream');


loadCSV = function(filepath) {
    var inputStream = fs.createReadStream(filepath)
        .pipe(new AutoDetectDecoderStream({ defaultEncoding: '1255' })); // If failed to guess encoding, default to 1255 

    inputStream
        .pipe(csvr({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row) {
            console.log('A row arrived: ', row);
        }).on('end', function (data) {
            console.log('No more rows!');
        });
}
module.exports = loadCSV;