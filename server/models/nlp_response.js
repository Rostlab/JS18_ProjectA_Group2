/**
 * Created by shayansiddiqui on 18.03.18.
 */
export default class NlpResponse {
    constructor(dataset, columns, title, plottype) {
        this.columns = columns; //Array of column model
        this.dataset = dataset;
        this.title = title;
        this.plottype =  plottype;
    }
}