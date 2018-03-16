import { JsonAxis, JsonLayout } from "./JsonLayout";

export class Layout {
    title: string;
    xaxis: Axis;
    yaxis: Axis;

    constructor(title: string, xaxis: Axis, yaxis: Axis) {
        this.title = title;
        this.xaxis = xaxis;
        this.yaxis = yaxis;
    }

    public static parseLayout(json: JsonLayout): Layout {
        const title: string = json.title;
        const xaxis: Axis = Axis.parseAxis(json.xaxis);
        const yaxis: Axis = Axis.parseAxis(json.yaxis);
        return new Layout(title, xaxis, yaxis);
    }
}

export class Axis {
    title: string;
    showgrid: boolean;
    zeroline: boolean;

    constructor(titel: string, showgrid: boolean, zeroline: boolean) {
        this.title = titel;
        this.showgrid = showgrid;
        this.zeroline = zeroline;
    }

    public static parseAxis(json: JsonAxis): Axis {
        const title: string = json.title;
        const showgrid: boolean = json.showgrid;
        const zeroline: boolean = json.zeroline;
        return new Axis(title, showgrid, zeroline);
    }
}
