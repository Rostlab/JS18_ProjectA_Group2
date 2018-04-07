/**
 * Created by shayansiddiqui on 18.03.18.
 */
/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */


import QueryResponse from '../models/query_response';
import Column from '../models/column';

const config = require('../config');
const logger = config.logger;
const crypto = require('crypto');
const stringSimilarity = require('string-similarity');
const csvMysql = require("../utils/csvtomysql");
const fs = require('fs');
const multer = require('multer');
const DIR = "./server/data/";
import Dictionary from '../utils/dictionary';

let knex = require('knex')(config.knex);

const func_mapping = {
    "count": "count",
    "maximum": "max",
    "minimum": "min",
    "average": "avg",
    "group": "groupBy",
    "countDistinct": "countDistinct",
    "distinct": "distinct",
};
const func_alias = {
    "count": "No of ",
    "maximum": "Maximum ",
    "minimum": "Minimum ",
    "average": "Average ",
    "countDistinct": "",
    "distinct": "",
};
//TODO: Move to database
const default_col = {
    'core_data': 'Employee Name',
    'indicators': 'value',
};

const storage = multer.diskStorage({
    destination: DIR,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) {
                cb(err);
            }
            fs.exists(DIR + file.originalname, function (exists) {
                var error = null;
                var fileName = "";
                if (exists) {
                    console.log("exists");
                    // Let user upload new csv file with different file name. Current file name table already exist in database.
                    //fileName = Date.now() + '_' + file.originalname;
                    error = new Error("Table with " + file.originalname + " exist in the database! Please upload csv with different name.");
                } else {
                    console.log("does not exist");
                    fileName = file.originalname;
                }
                if (error) {
                    cb(error);
                } else {
                    cb(null, fileName);
                }

            });
        })
    }

});

function _doColumnNameCorrection(nlp_column_name, actualColumns, table) {
    let column_name = null;
    if (actualColumns.length > 0) {
        const bestMatch = stringSimilarity.findBestMatch(nlp_column_name, actualColumns).bestMatch;
        if (bestMatch.rating > 0.80) {
            column_name = bestMatch.target;
        }
        else {
            //TODO: Replace with the database call instead of dictionary
            const tableDictionary = Dictionary[table];
            if (tableDictionary) {
                Object.keys(tableDictionary).forEach(key => {
                    console.log(nlp_column_name+' '+key);
                    if (tableDictionary[key].indexOf(nlp_column_name.toLowerCase()) > -1) {
                        console.log('1231231231231 setting value ' +key);
                        column_name = key;
                        return column_name;
                    }
                });
                if (!column_name) {
                    column_name = bestMatch.target;
                }

            }
        }
        console.log(column_name);
    }
    return column_name;
}

function _buildQuery(nlp_response) {
    return new Promise((resolve, reject) => {
        try {
            DataService.getColumns(nlp_response.dataset).then(actualColumns => {
                let querySelect = '';
                let queryWhere = '.where(1,1)';
                let queryOrder = '';
                let queryLimit = '';
                let queryGroup = [];
                let queryHaving = '';
                let queryHavingConditionValues = [];

                let datapoints =[];

                if(nlp_response.data1){
                    nlp_response.data1.name = _doColumnNameCorrection(nlp_response.data1.name, actualColumns, nlp_response.dataset);
                    datapoints.push(nlp_response.data1);
                }
                if(nlp_response.data2){
                    nlp_response.data2.name = _doColumnNameCorrection(nlp_response.data2.name, actualColumns, nlp_response.dataset);
                    datapoints.push(nlp_response.data2);
                }

                //data
                datapoints.forEach(function (data, idx) {
                    const col_to_use = data.only_conditional ? default_col[nlp_response.dataset] : data.name;
                    if (data.operation) {
                        console.log(col_to_use);
                        data.alias = Dictionary['function_alias'][data.operation] + (data.only_conditional ? data.condition_comparison_value : col_to_use);
                        querySelect += '.' + data.operation + '("' + col_to_use + ' as ' + data.alias + '")';
                    }
                    else {
                        data.alias = data.name;
                        querySelect += '.select("' + data.name + '")';
                    }
                    if (data.orderby) {
                        queryOrder += '.orderBy("' + data.name + "','" + data.orderby_direction + '")';
                    }
                    if (data.limit) {
                        queryLimit += '.limit(' + data.limit + ')';
                    }
                });
                console.log(querySelect);
                //conditions
                nlp_response.conditions.forEach(function (column, idx) {
                    column.name = _doColumnNameCorrection(column.name, actualColumns, nlp_response.dataset);

                    if (column.operation) {
                        column.alias = Dictionary['function_alias'][column.operation] + column.name;
                        querySelect += '.' + column.operation + '("' + column.name + ' as ' + column.alias + '")';
                    }
                    else {
                        column.alias = column.name;
                        querySelect += '.select("' + column.name + '")';
                    }


                    if (column.groupby) {
                        queryGroup.push('"' + column.name + '"')
                    }
                    if (column.condition_comparison_value.length > 0) {
                        if (!column.operation) {
                            if (column.condition_comparison_value.length > 1) {
                                queryWhere += '.andWhere("' + column.name + '"," in ","' + column.condition_comparison_value + '")'
                            }
                            else {
                                queryWhere += '.andWhere("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                            }
                        }
                        else {
                            if (queryHaving === '') {
                                queryHaving = '.havingRaw("' + column.operation + '(' + column.name + ')' + column.condition_comparison_operator + '?';
                            }
                            else {
                                queryHaving += ' and ' + column.operation + '(' + column.name + ')' + column.condition_comparison_operator + '?';
                            }
                            queryHavingConditionValues.push(column.condition_comparison_value)
                        }
                    }
                });
                if (queryHaving !== '') {
                    queryHaving += '",' + queryHavingConditionValues + ')';
                }

                let queryString = 'knex("' + nlp_response.dataset + '")' + querySelect + queryOrder + queryLimit + queryWhere;
                if (queryGroup.length > 0) {
                    queryString += '.groupBy(' + queryGroup.join(',') + ')' + queryHaving;
                }
                console.log(queryString);
                resolve(queryString);
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


//TODO:Important!! Remove this method
function _executeSelect(nlp_response) {
    return new Promise((resolve, reject) => {
        _buildQuery(nlp_response).then(queryString => {
            console.log(queryString);
            eval(queryString).on("query", function (generated_query) {
                console.log('Executing :' + generated_query.sql);
            }).then(rows => {
                resolve(rows);
            }, err => {
                reject(err);
            });
        }, err => {
            reject(err);
        });
    });
}

function _executeInsert(table, insert_arr) {
    return knex(table).insert(insert_arr).on("query", function (generated_query) {
        console.log('Executing :' + generated_query.sql);
    });
}


//TODO:Important!! Remove this method
function _executeSelectOld(columns, table, actualColumns) {
    const queryString = _buildQueryOld(columns, table, actualColumns);
    console.log(queryString);
    return eval(queryString).on("query", function (generated_query) {
        console.log('Executing :' + generated_query.sql);
    });
}


function _buildQueryOld(columns, table, actualColumns) {
    let querySelect = '';
    let queryWhere = '.where(1,1)';
    let queryGroup = [];
    let queryHaving = '';


    columns.forEach(function (column, idx) {
        if(column.name){
            if (actualColumns) {
                column.name = stringSimilarity.findBestMatch(column.name, actualColumns).bestMatch.target;
            }
            if (column.operation) {
                column.alias = func_alias[column.operation] + column.name;
                querySelect += '.' + func_mapping[column.operation] + '("' + column.name + ' as ' + column.alias + '")';
            }
            else {
                column.alias=column.name
                querySelect += '.select("' + column.name + '")';
            }
            if (column.condition_comparison_value) {
                if (!column.groupby) {
                    queryWhere += '.andWhere("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                }
                else {
                    if (queryHaving === '') {
                        queryHaving = '.having("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                    }
                    else {
                        queryHaving += '.andHaving("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                    }
                }
            }
            if (column.groupby) {
                queryGroup.push('"' + column.name + '"')
            }
        }
    });

    let queryString = 'knex("' + table + '")' + querySelect + queryWhere;
    if (queryGroup.length > 0) {
        queryString += '.groupBy(' + queryGroup.join(',') + ')' + queryHaving;
    }
    return queryString;
}

//TODO: Take care of changing the original model
//TODO:Important!! Remove this method
function _buildQueryOld_(columns, table, actualColumns) {
    let querySelect = '';
    let queryWhere = '.where(1,1)';
    let queryGroup = [];
    let queryHaving = '';
    let queryOrder = '';

    columns.forEach(function (column, idx) {
        if (column.name) {
            if (actualColumns) {
                const bestMatch = stringSimilarity.findBestMatch(column.name, actualColumns).bestMatch;
                //TODO: Replace with the database call instead of dictionary
                const tableDictionary = Dictionary[table];
                tableDictionary.keys().forEach(key => {
                    if (tableDictionary[key].indexOf(column.name.toLowerCase()) > -1) {
                        column.name = key;
                    }
                    else {
                        //TODO:raise an error for feedback from here.
                        column.name = bestMatch.target;
                    }
                })

            }
            if (column.operation) {
                column.alias = Dictionary['func_alias'][column.operation] + column.name;
                querySelect += '.' + func_mapping[column.operation] + '("' + column.name + ' as ' + column.alias + '")';
            }
            else {
                column.alias = column.name;
                querySelect += '.select("' + column.name + '")';
            }
            if (column.condition_comparison_value.length > 0) {
                if (!column.groupby) {
                    queryWhere += '.andWhere("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                }
                else {
                    if (queryHaving === '') {
                        queryHaving = '.having("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                    }
                    else {
                        queryHaving += '.andHaving("' + column.name + '","' + column.condition_comparison_operator + '","' + column.condition_comparison_value + '")'
                    }
                }
            }
            if (column.groupby) {
                queryGroup.push('"' + column.name + '"')
            }
        }
    });

    let queryString = 'knex("' + table + '")' + querySelect + queryWhere;
    if (queryGroup.length > 0) {
        queryString += '.groupBy(' + queryGroup.join(',') + ')' + queryHaving;
    }
    return queryString;
}


// To handle no-column queries.
function _reverseMapping(columns, table) {
    return new Promise((resolve, reject) => {
        try {
            logger.info('reversemapping started...');
            let columns_arr = [];
            let table_length = new Column("primKey");
            table_length.operation = "countDistinct";
            //table_length.alias = "tbl_length";
            columns_arr.push(table_length)

            columns.forEach(function (column) {
                if (column == 'primKey') {
                    return;
                }
                let col_ = new Column(column);
                col_.operation = "countDistinct";
                //col_.alias = column;
                columns_arr.push(col_);

            });
            console.log(columns_arr);
            _executeSelectOld(columns_arr, table, null).then(rows => {
                let promises = [];
                let uniqueness_threshold = config.revere_mapping.uniqueness_threshold;
                const table_count = rows[0]["primKey"];
                columns.forEach((column) => {
                    let uniqueness = rows[0][column] / table_count;
                    //TODO: uniqueness_threshold can be configured.
                    //TODO: Eradicate string issue with big blobs with uniqueness ~ 0.5.
                    console.log(uniqueness);
                    if (uniqueness < uniqueness_threshold) {
                        let col__ = new Column(column);
                        //col__.alias = column;
                        col__.operation = "distinct";
                        promises.push(_executeSelectOld([col__], table, null));
                    }
                });

                Promise.all(promises).then(values => {
                    let mappings = {};
                    values.forEach(value => {
                        value.forEach(val => {
                            for (var key in val) {
                                mappings[val[key]] = key;
                            }
                        });
                    });
                    _executeInsert("config", {"tablename": table, "meta": JSON.stringify(mappings)}).then(data => {
                        console.log(data);
                        resolve(mappings);
                    }, err => {
                        reject(err);
                    }).catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });

        } catch (err) {
            reject(err);
        }
    });
}


let DataService = {
    getData: function (nlp_response) {
        return new Promise((resolve, reject) => {
            try {
                let y = [];
                let x = [];
                let delta = [];
                let delta_title = '';
                console.log('executing select');
                _executeSelect(nlp_response).then(function (rows) {
                    console.log('executing select done');
                    //Take note of the order changed here
                    let keys = Object.keys(rows[0]);

                    console.log(nlp_response);
                    let y_col_name=null, x_col_name=null;
                    if(nlp_response.data1){
                        y_col_name = nlp_response.data1.alias;
                        if (y_col_name) {
                            keys.splice(keys.indexOf(y_col_name), 1);
                        }
                    }
                    if(nlp_response.data2){
                        x_col_name = nlp_response.data2.alias;
                        if (x_col_name) {
                            keys.splice(keys.indexOf(x_col_name), 1);
                        }
                    }

                    delta_title = keys.join('_');
                    rows.forEach(function (row, idx) {
                        if (y_col_name) {
                            y.push(row[y_col_name]);
                        }
                        if (x_col_name) {
                            x.push(row[x_col_name]);
                        }
                        if (keys.length > 0) {
                            let delta_val = row[keys[0]].trim();
                            for (let i = 1; i < keys.length; i++) {
                                delta_val += '_' + row[keys[i]].trim();
                            }
                            delta.push(delta_val);
                        }
                    });
                    let query_response = new QueryResponse(x, delta, nlp_response.plottype);

                    query_response.x = x;

                    query_response.y = y;
                    query_response.y_title = y_col_name;
                    query_response.x_title = x_col_name;
                    query_response.delta_title = delta_title;
                    query_response.title = nlp_response.title;
                    resolve(query_response);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    },

    getColumns: function (dataset) {
        return new Promise((resolve, reject) => {
            try {
                let columns = [new Column('COLUMN_NAME'), new Column('TABLE_SCHEMA'), new Column('TABLE_NAME')];
                columns[1].condition_comparison_value = config.mysql.database;
                columns[2].condition_comparison_value = dataset;

                _executeSelectOld(columns, 'INFORMATION_SCHEMA.COLUMNS', null).then(rows => {
                    let column_names = [];
                    rows.forEach((row, idx) => {
                        column_names.push(row['COLUMN_NAME']);
                    });
                    resolve(column_names);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    },

    importCsvToMysql: function (filePath, fileName) {
        logger.info('importcsvtomysql started...');
        return new Promise(function (resolve, reject) {
            csvMysql.import_(filePath, fileName).then(tableName => {
                console.log(filePath);
                tableName = fileName;
                DataService.getColumns(tableName).then(columns => {
                    console.log(columns);
                    _reverseMapping(columns, tableName).then(data => {
                        resolve(tableName);
                    }, err => {
                        reject(err);
                    });
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });
        });
    },

    getTables: function () {
        logger.info('getTable started...');
        return new Promise(function (resolve, reject) {
            const restrictedTables = ["config"];
            knex('information_schema.tables').select('table_name', 'table_schema').where('table_schema', config['mysql']['database']).then(rows => {
                let column_names = [];
                rows.forEach((row) => {
                    if (restrictedTables.includes(row['table_name'])) {
                        return;
                    } else {
                        column_names.push(row['table_name']);
                    }
                });
                resolve(column_names);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
        });
    },

    upload: multer({storage: storage}).single('fileItem'),

    test: function (next) {
        let columns = ["countryname", "countrycode", "indicatorname", "indicatorcode", "year", "value"];
        _reverseMapping(columns, "indicators").then(data => {
            next(null, data);
        }, err => {
            next(err);
        });
    }
};

module.exports = DataService;
