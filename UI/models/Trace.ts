import {JsonTrace} from "./JsonTrace";

export class Trace {
    x: number[];
    values: number[];
    labels: string[];
    y: number[];
    type: string;

    constructor(x: number[], y: any[], type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public static parseTraces(jsonArray: JsonTrace[]): Trace[] {
        const data = [];
        jsonArray.forEach(json => {
            data.push(Trace.parseTrace(json));
        });
        return data;
    }

    public static parseTrace(json: JsonTrace): Trace {
        const x: number[] = json.x;
        const y: number[] = json.y;
        const type: string = json.type;
        return new Trace(x, y, type);
    }
}
