var Promise = require('promise');
const DF = require('data-forge');
var stringSimilarity = require('string-similarity');
const csvFilePath="server/data/core_dataset.csv";

//Working query: Plot a pie chart for number of employees in each department

var nlptodata = function(nlpobj){
    //console.log(nlpobj);
    return new Promise(function (fulfill, reject){
        var isGrouped = isCount = false;
        if(nlpobj.intent.name == 'plot'){
            
            entities = {};
            nlpobj.entities.forEach(function(val, idx){
                entities[val.entity] = val.value;
            });
            entityKeys = Object.keys(entities)
            if(entityKeys.includes('count_x') && entities.count_x !== 'undefined'){
                isCount = true;
                var splt = entities.count_x.split(" ");
                entities.x = splt[splt.length - 1];
            }

            if(entityKeys.includes('count') && entities.count !== 'undefined'){
                isCount = true;
                var splt = entities.count.split(" ");
                entities.x = splt[splt.length - 1];
            }
            
            if(entityKeys.includes('group_y') && entities.group_y !== 'underfined'){
                isGrouped = true;
                var splt = entities.group_y.split(" ");
                entities.y = splt[splt.length - 1];
            }

            columnname = ['Employee Name',	'Employee Number',	'State', 'Zip',
            'DOB', 'Age', 'Sex',	'MaritalDesc',	'CitizenDesc',	'Hispanic/Latino',	'RaceDesc',
            'Date of Hire',	'Date of Termination',	'Reason For Term',	'Employment Status',	
            'Department',	'Position',	'Pay Rate',	'Manager Name',	'Employee Source',	'Performance',
            'Score'];
            var csvOptions = { columnNames:  columnname};
            var df = DF.readFileSync(csvFilePath).parseCSV(csvOptions);//.toArray();
            //console.log('entities', entities.x);
            //console.log(df.first()['Employee Name']);
            
            var iterator = df.getIterator();
            while (iterator.moveNext()) {
                var pair = iterator.getCurrent();
                //console.log(pair[1]);
            }
            console.log(entities);
            var matche_x = stringSimilarity.findBestMatch(entities.x, columnname).bestMatch.target;
            var matche_y = stringSimilarity.findBestMatch(entities.y, columnname).bestMatch.target;
            //console.log(matche_x, matche_y);
            var df_sub = df.subset([matche_x, matche_y]);
            
            var data = formatting(df_sub);
            data["plot_type"] = entities.plot_type;
            data["user_query"] = nlpobj.text;
            //console.log(data);

            if(isGrouped){
                var dfx = df.groupBy(function (row) {
                    //consolr.log(row)
                    return row[entities.y];
                });
            }

            if(isCount){

            }
            fulfill(data);
        } else {
            reject("Sorry, your query is meaningless to us.");
        }
    });
}

var formatting = function(df){

    var columns = df.getColumns();
    var arrayOfColumns = columns.toArray();
    data = {};
    for (var column in arrayOfColumns) {
        var name = arrayOfColumns[column].name;
        data[name] = [];
        var series = arrayOfColumns[column].series;
        series.forEach(function (value) {
            data[name].push(value);
        });
    }
    return data;
}

module.exports = nlptodata;