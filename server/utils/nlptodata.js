var Promise = require('promise');
const DF = require('data-forge');
var stringSimilarity = require('string-similarity');
const csvFilePath="server/data/core_dataset.csv";

//Working query: Plot a pie chart for number of employees in each department
var utils = {
    nlptodata: function(nlpobj){
        //console.log(nlpobj);
        return new Promise(function (fulfill, reject){
            var isGrouped = isCount = false;
            if(nlpobj.intent.name == 'plot'){
                
                // get this data dynamically from the selected dataset.
                actualColumnName = ['Employee Name',	'Employee Number',	'State', 'Zip',
                'DOB', 'Age', 'Sex',	'MaritalDesc',	'CitizenDesc',	'Hispanic/Latino',	'RaceDesc',
                'Date of Hire',	'Date of Termination',	'Reason For Term',	'Employment Status',	
                'Department',	'Position',	'Pay Rate',	'Manager Name',	'Employee Source',	'Performance',
                'Score'];

                entities = {};
                nlpobj.entities.forEach(function(val, idx){
                    entities[val.entity] = val.value;
                });
                console.log(entities);

                entityKeys = Object.keys(entities)
                columnname = [];
                if(entityKeys.includes('x')){
                    var matche_x = stringSimilarity.findBestMatch(entities.x, actualColumnName).bestMatch.target;
                    columnname.push(matche_x);

                    if(entityKeys.includes('operation_x')){
                        columnname.push(entities.operation_x);
                    }
                    if(entityKeys.includes('condition_x')){
                        columnname.push(entities.condition_x);
                        if(entityKeys.includes('condition_const_x')){
                            columnname.push(entities.condition_const_x);
                        }
                    }
                }
                if(entityKeys.includes('y')){
                    var matche_y = stringSimilarity.findBestMatch(entities.y, actualColumnName).bestMatch.target;
                    columnname.push(matche_y);
                }
                if(entityKeys.includes('operation_y')){
                    columnname.push(entities.operation_y);
                }
                if(entityKeys.includes('condition_y')){
                    columnname.push(entities.condition_y);
                }
                if(entityKeys.includes('condition_const_y')){
                    columnname.push(entities.condition_const_y);
                }
                if(entityKeys.includes('z')){
                    var matche_z = stringSimilarity.findBestMatch(entities.z, actualColumnName).bestMatch.target;
                    columnname.push(matche_z);
                }
                if(entityKeys.includes('operation')){
                    columnname.push(entities.operation);
                }
                if(entityKeys.includes('condition')){
                    columnname.push(entities.condition);
                }
                if(entityKeys.includes('condition_const')){
                    columnname.push(entities.condition_const);
                }

                /*
                //var csvOptions = { columnNames:  actualColumnName};
                //var df = DF.readFileSync(csvFilePath).parseCSV(csvOptions);//.toArray();
                //console.log('entities', entities.x);
                //console.log(df.first()['Employee Name']);
                
                var iterator = df.getIterator();
                while (iterator.moveNext()) {
                    var pair = iterator.getCurrent();
                    //console.log(pair[1]);
                }
                
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
                */

                fulfill(data);
            } else {
                reject("Sorry, your query is meaningless to us.");
            }
        });
    },

    formatting: function(df){

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
}

module.exports = utils;