/**
 * Created by shayansiddiqui on 18.03.18.
 */
export default class NlpResponse {
    constructor(dataset) {
        this.data1 = null; //column type
        this.data2 = null; //column type
        this.conditions = []; //list of column type
        this.dataset = dataset; //string
        this.title = ''; //string
        this.plottype =  ''; //string
    }
}