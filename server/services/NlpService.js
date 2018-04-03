/**
 *@author :: Jyotirmay
 *@Date :: 03rd March, 2018
 */

import NlpResponse from '../models/nlp_response';
import Column from '../models/column'

const rp = require('request-promise');
const config = require('../config');
const logger = config.logger;
//TODO: Can be generalized further.
//TODO: Remove y from here after more training.
const secondary_entities = ['y', 'z'];

function _createColumn(targetEntity, entities) {
    if(targetEntity){
        let column = new Column(targetEntity.value);
        const obj = entities.find(function (obj) {
            return obj['entity'] === 'operation_' + targetEntity.entity;
        });
        if (obj) {
            if (obj.value === 'group') {
                column.groupby = true
            }
            else {
                column.operation = obj.value
            }
        }
        return column;
    }
    else{
        return new Column(null);
    }
}

function _createResponseObject(res, dataset) {
    //TODO: here x and y are out of order, need to correct it
    let columns = [];
    let plottype = null;
    const obj_x = res["entities"].find(function (obj) {
        return obj['entity'] === 'x';
    });
    columns.push(_createColumn(obj_x, res.entities));

    //TODO:Need to enable later after more training
    // const obj_y = res["entities"].find(function (obj) {
    //     return obj['entity'] === 'y';
    // });
    // columns.push(_createColumn(obj_y, res.entities));

    res["entities"].forEach(function (val, idx) {
        if (secondary_entities.indexOf(val.entity) > -1) {
            let column = _createColumn(val, res.entities);
            columns.push(column);
        }
        else if (val.entity === 'plot_type') {
            plottype = val.value;
        }
    });
    return new NlpResponse(dataset, columns, res.text, plottype);
}

let NlpService = {
    processQuery: function (query, dataset) {
        //TODO: Standardize model for nlp engine

        return new Promise((resolve, reject) => {


            const propertiesObject = {q: query, project: config.nlp_project, model: config.nlp_model};
            rp({url: config.nlp_server + '/parse', qs: propertiesObject}).then(function (res) {
                logger.info(res);
                const nlp_response = _createResponseObject(JSON.parse(res), dataset);
                resolve(nlp_response);
            }, function (err) {
                reject(err);
            });
        });
    }
};

module.exports = NlpService;
