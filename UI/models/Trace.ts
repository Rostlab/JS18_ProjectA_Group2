import {Data} from "./Data";
import {JsonData} from "./JsonData";

export class Trace {
    x: number[];
    y: number[];
    type: string;

    constructor(x: number[], y: number[], type: string,) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    public static parseTrace(jsonTrace: JsonTrace): Trace {
        const x: number[] = jsonTrace.x;
        const y: number[] = jsonTrace.y;
        const type: string = jsonTrace.type;
        return new Trace(x, y, type);
    }
}
