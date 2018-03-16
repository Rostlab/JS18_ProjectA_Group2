var Promise = require('promise');
var stringSimilarity = require('string-similarity');
var config = require('../config');

var knex = require('knex')({
    client: 'mysql',
    connection: config.mysql,
    pool: { min: 0, max: 7 },
    acquireConnectionTimeout: 5000
  });

nlp_model = {
    "x": false, "y": false, "z": false,
    "count": "count", "maximum": "max", "minimum": "min", "average": "avg", "group": "groupBy",
    "operation_x": false, "operation_y": false, "operation": false,
    "plot_type": false
}

//Working query: all rostlab example query.
var utils = {
    nlptodata_mysql: function(nlpobj, dataset){
        return new Promise(function (fulfill, reject){
    
            if(nlpobj.intent.name == 'plot'){
                promise = utils.getColumns(dataset);
                promise.then(function(actualColumns){
                    try{
                        entities = {};
                        isGroup = false;
                        nlpobj.entities.forEach(function(val, idx){
                            if(val.entity in entities){
                                val.entity = (val.entity.length == 1) ? val.entity = 'z': val.entity = "operation";
                            }
                            entities[val.entity] = val.value;
                            nlp_model[val.entity] = true;
                        });
                        
                        groups = [];
                        if(nlp_model['x']){
                            var match_x = stringSimilarity.findBestMatch(entities.x, actualColumns).bestMatch.target;
                            operation_x = '.select("'+match_x+' as columnA")';
                            if(nlp_model['operation_x']){
                                if (entities['operation_x'] == 'group'){
                                    isGroup = true;
                                    groups.push("'"+match_x+"'");
                                } else {
                                    operation_x += '.'+nlp_model[entities['operation_x']]+'("'+match_x+' as columnA" )';
                                }
                            }
                        } else {
                            operation_x = "";
                        }

                        if(nlp_model['y']){
                            var match_y = stringSimilarity.findBestMatch(entities.y, actualColumns).bestMatch.target;
                            operation_y = '.select("'+match_y+' as columnB")';
                            if(nlp_model['operation_y']){
                                if (entities['operation_y'] == 'group'){
                                    isGroup = true;
                                    groups.push("'"+match_y+"'");
                                } else {
                                    operation_y += '.'+nlp_model[entities['operation_y']]+'("'+match_y+' as columnB")';
                                }
                            }
                        } else {
                            operation_y = "";
                        }

                        if(nlp_model['z']){
                            var match_z = stringSimilarity.findBestMatch(entities.z, actualColumns).bestMatch.target;
                            operation_z = '.select("'+match_z+' as columnC")';
                            if(nlp_model['operation']){
                                if (entities['operation'] == 'group'){
                                    isGroup = true;
                                    groups.push("'"+match_z+"'");
                                } else {
                                    operation_z += '.'+nlp_model[entities['operation']]+'("'+match_z+' as columnC")';
                                }
                            } 
                        } else {
                            operation_z = "";
                        }
                    
                        operation_group = (isGroup) ? `.groupBy(`+ groups.join(',') +`)` : "";

                        kquery = `knex("`+dataset+`")` + operation_x + operation_y + operation_z + operation_group;
                        //fulfill(kquery);
                        data = {"columnA":{}, "columnB":{}, "columnC":{}, "plotType": entities.plot_type, "nlp_out":nlpobj,
                        "userQuery": nlpobj.text, "kquery":kquery, "matched_columns": [match_x, match_y, match_z]}

                    
                        eval(kquery).on("query", function(generated_query){
                            data.kquery = generated_query;
                        }).then(function(rows){

                            rows.forEach(function(val, idx){
                                if(val.columnA != 'undefined'){
                                    data.columnA[idx] = val.columnA;
                                }
                                if(val.columnB != 'undefined'){
                                    data.columnB[idx] = val.columnB;
                                }
                                if(val.columnC != 'undefined'){
                                    data.columnC[idx] = val.columnC;
                                }
                            });
                            return data;
                        }).then(function(data){
                            fulfill(data);
                        }).catch(function(error){
                            reject(error);
                        });
                    } catch (error){
                        reject(error);
                    }

                }, function(err){
                    reject(err);
                });
        }
        });
    },

    getColumns: function(dataset){
        
        return new Promise(function(fulfill, reject){
            try{
                actualColumns = [];
                knex.select('COLUMN_NAME').from('INFORMATION_SCHEMA.COLUMNS')
                .where({
                    TABLE_SCHEMA: config.mysql.database,
                    TABLE_NAME: dataset
                }).on("query", function(generated_query){
                    //console.log(generated_query);
                })
                .then(function(rows) {
                    rows.forEach(function(val, idx){
                        actualColumns.push(val.COLUMN_NAME);
                    });
                    return actualColumns;
                }).then(function(actualColumns){
                    fulfill(actualColumns);
                }).catch(function(error){
                    reject(error);
                });
            } catch(error){
                reject(error);
            }
        });
    }
}

module.exports = utils;