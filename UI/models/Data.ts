import {Trace} from "./Trace";
import {JsonDatas} from "./JsonData";

export class Data {
    traces: Trace[];

    constructor(traces: Trace[]) {
        this.traces = traces;
    }

    public static parseDatas(jsonArray: JsonDatas[]): Data {
        const data = [];
        jsonArray.forEach(json => {
            data.push(Trace.parseTrace(json));
        });
        return data;
    }
}
