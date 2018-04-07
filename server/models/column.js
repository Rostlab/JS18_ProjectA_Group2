/**
 * Created by shayansiddiqui on 18.03.18.
 */
export default class Column {
    constructor(name) {
        this.name = name;
        this.alias = name;
        this.operation=null;
        this.date_column = null;
        this.groupby = false;
        this.orderby = false;
        this.orderby_direction='asc';
        this.limit = null;
        this.condition_comparison_value = [];
        this.condition_operation=null;
        this.condition_comparison_operator = '=';
        this.only_conditional=false;
    }
}