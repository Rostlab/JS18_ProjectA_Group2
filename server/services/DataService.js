/**
 * Created by shayansiddiqui on 18.03.18.
 */
/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */

const config = require('../config');
import QueryResponse from '../models/query_response';
import Column from '../models/column';
const crypto = require('crypto');
const stringSimilarity = require('string-similarity');
const csvMysql = require("../utils/csvtomysql");
const db = require("../utils/db");
const fs = require('fs');
const multer = require('multer');
const DIR = "./server/data/";

const storage = multer.diskStorage({
  destination: DIR,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);
      fs.exists(DIR + file.originalname, function(exists) {
        var fileName;
        if (exists) {
          console.log("exists");
          fileName = Date.now() + '_' + file.originalname;
        } else {
          console.log("does not exist");
          fileName = file.originalname;
        } 
        cb(null, fileName)
    });
    })
  }
});

let knex = require('knex')({
    client: 'mysql',
    connection: config.mysql,
    pool: {min: 0, max: 7},
    acquireConnectionTimeout: 5000
});

const func_mapping = {
    "count": "count",
    "maximum": "max",
    "minimum": "min",
    "average": "avg",
    "group": "groupBy",
};
const func_alias = {
    "count": "No of ",
    "maximum": "Maximum ",
    "minimum": "Minimum ",
    "average": "Average ",
};
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

    importCsvToMysql: function(filePath, tableName){
        return new Promise(function(fulfill, reject){
            try{
                csvMysql.import(filePath, tableName);
            } catch(error){
                reject(error);
            }
        });
    },

    getTables: function(){
        return new Promise(function(fulfill, reject){
            try{                
                db.getTables(function(result){
                    console.log(result);
                    fulfill(result);
                });
            } catch(error){
                reject(error);
            }
        });
    },

    upload: multer({storage: storage}).single('fileItem')
};

module.exports = DataService;
