/**
 * Created by shayansiddiqui on 19.03.18.
 */
export class QueryRequest {
    userquery: string;
    dataset: string;
    constructor(userquery: string, dataset: string) {
        this.userquery = userquery;
        this.dataset = dataset;
    }
}