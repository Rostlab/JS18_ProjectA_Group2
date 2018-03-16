import { JsonTrace } from "./JsonTrace";
import { JsonLayout } from "./JsonLayout";
import { JsonOptions } from "./JsonOptions";

export class JsonData {
    traces: JsonTrace[];
    layout: JsonLayout;
    options: JsonOptions;
}