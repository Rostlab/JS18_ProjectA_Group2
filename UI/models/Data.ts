import { Layout } from "./Layout";
import { Trace } from "./Trace";
import { Options } from "./Options";
import { JsonData } from "./JsonData";

export class Data {
    traces: Trace[];
    layout: Layout;
    options: Options;

    constructor(traces: Trace[], layout: Layout, options: Options) {
        this.traces = traces;
        this.layout = layout;
        this.options = options;
    }

    public static parseData(json: JsonData): Data {
        const traces: Trace[] = Trace.parseTraces(json.traces);
        const layout: Layout = Layout.parseLayout(json.layout);
        const options: Options = Options.parseOptions(json.options);
        return new Data(traces, layout, options);
    }
}