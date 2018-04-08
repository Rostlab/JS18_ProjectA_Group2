const config = require('../config');
let knex = require('knex')(config.knex);

let ReverseMappingService = {
    getColumnAndCCV: function (ccv, dataset) {
        return new Promise((resolve,reject)=>{
            knex(config.config_table).select('meta').where('tablename', dataset).then(rows => {
                const meta = JSON.parse(rows[0]['meta']);
                //TODO:Remove before push
                let col_name=meta[ccv.trim()];
                let ccv_list =[];
                if (!col_name) {
                    let tokens = ccv.split(/and/i);
                    if(tokens.length>1){
                        const token1 = tokens[0].trim();
                        col_name = meta[token1];
                        if(col_name){
                            ccv_list.push(token1);
                            //    Checking with adding every word iteratively.
                            const check_tokens = token1.split(' ');
                            for(let i=1;i<tokens.length;i++){
                                let i_token = tokens[i].trim();
                                let check_token_string='';
                                check_tokens.every(check_token=>{
                                    check_token_string += ' '+check_token;
                                    const test_ccv = check_token_string+' '+i_token;
                                    const found_col = meta[test_ccv.trim()];
                                    if(found_col && (col_name === found_col)){
                                        ccv_list.push(test_ccv);
                                        return false;
                                    }
                                    return true;
                                });
                            }
                            resolve({col_name:col_name, ccv_list:ccv_list});
                        }
                        else{
                            reject(new Error("Not able to find any relevant columns"));
                        }
                    }
                    else{
                        reject(new Error("Not able to find any relevant columns"));
                    }
                }
                else{
                    ccv_list.push(ccv);
                    resolve({col_name:col_name, ccv_list:ccv_list});
                }
            });
        })
    }
};

module.exports = ReverseMappingService;