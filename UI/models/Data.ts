import { Layout } from "./Layout";
import { Trace } from "./Trace";
import { Options } from "./Options";


export class Data{
    traces: Trace[];
    layout: Layout;
    options: Options;

        constructor(traces: Trace[], layout: Layout, options: Options) {
            this.traces = traces;
            this.layout = layout;
            this.options = options;
        }
}