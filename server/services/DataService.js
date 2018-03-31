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


let knex = require('knex')({
    client: 'mysql',
    connection: config.mysql,
    pool: {min: 0, max: 7},
    acquireConnectionTimeout: 5000,
    fetchAsString: [ 'number', 'clob', 'blob' ]
});

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

const storage = multer.diskStorage({
    destination: DIR,
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if(err){
                cb(err);
            }
            fs.exists(DIR + file.originalname, function(exists) {
                var error = null;
                var fileName = "";
                if (exists) {
                    console.log("exists");
                    // Let user upload new csv file with different file name. Current file name table already exist in database.
                    //fileName = Date.now() + '_' + file.originalname;
                    error = new Error("Table with "+file.originalname+" exist in the database! Please upload csv with different name.");
                } else {
                    console.log("does not exist");
                    fileName = file.originalname;
                }
                if(error){
                    cb(error);
                } else {
                    cb(null, fileName);
                }

            });
        })
    }
});

//TODO: Take care of changing the original model
function _buildQuery(columns, table, actualColumns) {
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


//TODO:Operations on having clause
function _executeSelect(columns, table, actualColumns) {
    const queryString = _buildQuery(columns, table, actualColumns);
    console.log(queryString);
    return eval(queryString).on("query", function (generated_query) {
        console.log('Executing :' + generated_query.sql);
    });
}


function _executeInsert(table, insert_arr) {

    return knex(table).insert(insert_arr).on("query", function (generated_query) {
        console.log('Executing :' + generated_query.sql);
    });
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

            _executeSelect(columns_arr, table, null).then(rows => {
                let promises = [];
                let uniqueness_threshold = 0.10;
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
                        promises.push(_executeSelect([col__], table, null));
                    }
                });

                Promise.all(promises).then(values => {
                    let mappings = {};
                    values.forEach(value => {
                        value.forEach( val => {
                            for(var key in val){
                                mappings[val[key]] = key;
                            }
                        });
                    });
                    _executeInsert("config", { "tablename":table, "meta": JSON.stringify(mappings) }).then(data => {
                        console.log(data);
                        resolve(mappings);
                    }, err => {
                        reject(err);
                    }).catch(function(err) {
                        console.log(err);
                        reject(err);
                    });
                }, err => {
                    reject(err);
                });
            }, err => {
                reject(err);
            });

        } catch(err) {
            reject(err);
        }
    });
}


let DataService = {
    //TODO: Standardize model for nlp engine
    getData: function (nlp_response) {
        return new Promise((resolve, reject) => {
            try {
                let y = [];
                let x = [];
                let delta = [];
                let delta_title = '';
                this.getColumns(nlp_response.dataset).then(actualColumns => {
                    _executeSelect(nlp_response.columns, nlp_response.dataset, actualColumns).then(function (rows) {
                        console.log(nlp_response.columns);
                        //Take note of the order changed here
                        const y_col_name = nlp_response.columns[0].alias;
                        //TODO:Need to enable later after more training
                        // const x_col_name = nlp_response.columns[1].alias;
                        let keys = Object.keys(rows[0]);
                        if(y_col_name){
                            keys.splice(keys.indexOf(y_col_name), 1);
                        }
                        //TODO:Need to enable later after more training
                        // if(x_col_name){
                        //     keys.splice(keys.indexOf(x_col_name), 1);
                        // }
                        delta_title = keys.join('_');
                        rows.forEach(function (row, idx) {
                            if(y_col_name){
                                y.push(row[y_col_name]);
                            }
                            //TODO:Need to enable later after more training
                            // if(x_col_name){
                            //     x.push(row[x_col_name]);
                            // }

                            if (keys.length > 0) {
                                let delta_val = row[keys[0]];
                                for (let i = 1; i < keys.length; i++) {
                                    delta_val += '_' + row[keys[i]];
                                }
                                delta.push(delta_val);
                            }
                        });
                        let query_response = new QueryResponse(x, delta, nlp_response.plottype);

                        //TODO:Need to remove later after more training
                        query_response.x = delta;

                        query_response.y = y;
                        query_response.y_title = y_col_name;
                        //TODO:Need to enable later after more training
                        // query_response.x_title = x_col_name;
                        //TODO:Need to remove later after more training
                        query_response.x_title = delta_title;

                        query_response.delta_title = delta_title;
                        query_response.title = nlp_response.title;
                        console.log(query_response);
                        resolve(query_response);
                    })
                })
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

                _executeSelect(columns, 'INFORMATION_SCHEMA.COLUMNS', null).then(rows => {
                    let column_names = [];
                    rows.forEach((row, idx) => {
                        column_names.push(row['COLUMN_NAME']);
                    });
                    resolve(column_names);
                })
            } catch (err) {
                reject(err);
            }
        });
    },

    importCsvToMysql: function(filePath, fileName){
        logger.info('importcsvtomysql started...');
        return new Promise(function(resolve, reject){
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

    getTables: function(){
        logger.info('importcsvtomysql started...');
        return new Promise(function(resolve, reject){
            try {
                const restrictedTables = ["config"];
                let columns = [new Column('table_name'), new Column('table_schema')];
                columns[1].condition_comparison_value = config.mysql.database;

                _executeSelect(columns, 'information_schema.tables', null).then(rows => {
                    let column_names = [];

                    rows.forEach((row) => {
                        if(restrictedTables.includes(row['table_name'])) {
                            return;
                        } else {
                            column_names.push(row['table_name']);
                        }
                    });
                    resolve(column_names);
                });
            } catch (err) {
                reject(err);
            }

        });
    },

    upload: multer({storage: storage}).single('fileItem'),

    test: function(next){
        let columns = ["countryname", "countrycode", "indicatorname", "indicatorcode", "year", "value"];
        _reverseMapping(columns, "indicators").then(data => {
            next(null, data);
        }, err => {
            next(err);
        });
    }
};

module.exports = DataService;
