/**
 * Created by shayansiddiqui on 19.03.18.
 */
export class QueryResponse {
    x: any[];
    y: any[];
    delta: any[];
    x_title: string;
    y_title: string;
    delta_title:string;
    plot_type: string;
    title: string;

    constructor(x: any[], y: any[], x_title: string, y_title: string, plot_type: string, title: string) {
        this.x = x;
        this.y = y;
        this.x_title = x_title;
        this.y_title = y_title;
        this.plot_type = plot_type;
        this.title = title;
    }
}