/**
 *@author :: Shayan Ahmad Siddiqui
 *@Date :: 05rd April, 2018
 */

import NlpResponse from '../models/nlp_response';
import Column from '../models/column'
const ReverseMappingService = require("./ReverseMappingService");

const rp = require('request-promise');
const config = require('../config');
const logger = config.logger;


function _createColumn(raw_column) {
    let column = new Column(raw_column.col);
    column.operation = raw_column.op;
    if (raw_column.group) {
        column.groupby = true;
    }
    if (raw_column.order) {
        column.orderby = true;
        column.orderby_direction = raw_column.order;
    }
    column.limit = raw_column.limit;
    if(raw_column.ccv){
        if(raw_column.ccv.constructor === Array){
            column.condition_comparison_value=raw_column.ccv;
        }else{
            if(raw_column.cco === 'between'){
                let between_ccv = raw_column.ccv.split(/and|&|,/i);
                column.condition_comparison_value = between_ccv;
            }
            else{
                const num_ccv = Number.parseFloat(raw_column.ccv);
                if(!Number.isNaN(raw_column.ccv))
                    column.condition_comparison_value = [num_ccv];
                else
                    column.condition_comparison_value = [raw_column.ccv];
            }
        }
    }
    if(raw_column.cco){
        column.condition_comparison_operator = raw_column.cco;
    }
    if(raw_column.col_d){
        column.date_column = raw_column.col_d;
    }

    if(raw_column.only_conditional){
        column.only_conditional=true;
    }
    return column;
}


function _createResponseObject(raw_nlp_response, dataset, text) {
    console.log('creating response');
    const nlpResponse = new NlpResponse(dataset);
    nlpResponse.title = text;
    if (raw_nlp_response['d1']) {
        nlpResponse.data1 = _createColumn(raw_nlp_response['d1']);
        if (nlpResponse.data1.condition_comparison_value.length > 0) {
            const condition = Object.assign({}, nlpResponse.data1);
            nlpResponse.conditions.push(condition);
        }
    }

    if (raw_nlp_response['d2']) {
        nlpResponse.data2 = _createColumn(raw_nlp_response['d2']);
        if (nlpResponse.data2.condition_comparison_value.length > 0) {
            const condition = Object.assign({}, nlpResponse.data2);
            nlpResponse.conditions.push(condition);
        }
    }else if(raw_nlp_response['chart']['plot_type'] ==='line' || raw_nlp_response['chart']['plot_type'] ==='scatter'){
        if(nlpResponse.data1.condition_comparison_value.length > 1){
            nlpResponse.data2 = _createColumn(raw_nlp_response['d1']);
            nlpResponse.data1.condition_comparison_value = [nlpResponse.data1.condition_comparison_value[0]];
            nlpResponse.data2.condition_comparison_value = [nlpResponse.data2.condition_comparison_value[1]];
        }
    }

    if (raw_nlp_response['chart'])
        nlpResponse.plottype = raw_nlp_response['chart']['plot_type'];

    if (raw_nlp_response['l'].length > 0) {
        raw_nlp_response['l'].forEach((l, i) => {
            const condition = _createColumn(l);
            nlpResponse.conditions.push(condition);
        })
    }
    console.log('after create response');
    console.log(nlpResponse);

    return nlpResponse;
}


function _callNlp(query, project, model) {
    const propertiesObject = {q: query, project: project, model: model};
    return rp({url: config.nlp_server + '/parse', qs: propertiesObject});
}

function _extractCCV(str) {
    let ret = "";

    if (/“/.test(str)) {
        ret = str.match(/“(.*?)”/)[1];
    } else {
        ret = str;
    }
    return ret;
}


/*
 returned object:
 {
 col:string,
 group:string,
 plot_type:string,
 op:string,
 cco:string
 ccv:string
 order:asc, desc
 limit:int
 col_d:string
 only_conditional:boolean
 }
 */
function _processSentenceElement(query, dataset) {
    return new Promise((resolve, reject) => {
        console.log('Process sentence elements');
        console.log(query);
        _callNlp(query, config.nlp_project, config.nlp_model_ops).then(function (res) {
            res=JSON.parse(res);

            let ops = {};
            res["entities"].forEach(function (obj, idx) {
                ops[obj.entity] = obj.value;
            });
            console.log(ops);
            if (ops.hasOwnProperty('ccv') && !ops.hasOwnProperty('col')) {
                console.log('doing reverse mapping for :'+ops["ccv"]);
                const ccv = _extractCCV(ops["ccv"]);
                ReverseMappingService.getColumnAndCCV(ccv, dataset).then(obj => {
                    ops['col'] = obj['col_name'];
                    ops['ccv'] = obj['ccv_list'];
                    //TODO: Need to think more
                    ops['only_conditional'] = true;
                    resolve(ops);
                });
            }else{
                resolve(ops);
            }

        }, function (err) {
            reject(err);
        });
    });
}


/*Gets the sentence element from the nlp engine and creates respective columns out of it
 returned object:
 {
 d1:string
 d2:string
 l:string[]
 chart:string
 text:string
 }
 */
function _createSentenceElements(query) {
    return new Promise((resolve, reject) => {
        _callNlp(query, config.nlp_project, config.nlp_model_sentence).then(function (res) {
            res=JSON.parse(res);
            let sentence = {
                'l': []
            };
            res["entities"].forEach(function (obj, idx) {
                if (obj.entity === 'l') {
                    sentence[obj.entity].push(obj.value);
                } else {
                    sentence[obj.entity] = obj.value;
                }
            });
            sentence['text'] = res.text;
            resolve(sentence);
        }, function (err) {
            reject(err);
        });
    });
}

let NlpService = {
    processQuery: function (query, dataset) {
        //TODO: Cen be made more generic
        return new Promise((resolve, reject) => {
            let promises = [];
            _createSentenceElements(query).then(sentence => {

                let raw_nlp_response = {
                    'l': []
                };

                if (sentence.d1) {
                    const promise = _processSentenceElement(sentence.d1, dataset);
                    promises.push(promise);
                    promise.then(res => {
                        raw_nlp_response['d1'] = res;
                    });
                }
                if (sentence.d2) {
                    const promise = _processSentenceElement(sentence.d2, dataset);
                    promises.push(promise);
                    promise.then(res => {
                        raw_nlp_response['d2'] = res;
                    });
                }
                if (sentence.chart) {
                    const promise = _processSentenceElement(sentence.chart, dataset);
                    promises.push(promise);
                    promise.then(res => {
                        raw_nlp_response['chart'] = res;
                    });
                }
                if (sentence.l.length > 0) {
                    sentence.l.forEach((l, i) => {
                        const promise = _processSentenceElement(l, dataset);
                        promises.push(promise);
                        promise.then(res => {
                            raw_nlp_response['l'].push(res);
                        });
                    });
                }

                Promise.all(promises).then(values => {
                    const nlpResponse = _createResponseObject(raw_nlp_response, dataset, sentence.text);
                    resolve(nlpResponse);
                },err=>{
                    console.log(err);
                    reject(err);
                });
            }, err => {
                logger.error(err);
                reject(err);
            });

        });
    }
};

module.exports = NlpService;
