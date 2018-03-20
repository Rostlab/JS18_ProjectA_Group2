/**
 * Created by shayansiddiqui on 18.03.18.
 */
export default class QueryRespose {
    constructor(x, delta, plot_type) {
        this.x = x;
        this.y = null;
        this.delta = delta;
        this.x_title = '';
        this.y_title = '';
        this.delta_title = '';
        this.plot_type = plot_type;
        this.title = '';
    }
}