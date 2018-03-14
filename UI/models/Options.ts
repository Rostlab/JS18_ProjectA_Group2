import { JsonOptions } from "./JsonOptions";

export class Options {

    constructor() {
    }

    public static parseOptions(json: JsonOptions): Options {
        return new Options();
    }
}
