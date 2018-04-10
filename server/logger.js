const winston = require('winston');
const fs = require("fs");


class LogFiles{

    constructor(){
        this.logRootPath = './server/log';
        this.debugFilePath = './server/log/debug';
        this.exceptionFilePath = './server/log/exception';

        this.setUp();

    }

    setUp(){
        try {
            if (!fs.existsSync(this.logRootPath)) {
                fs.mkdirSync(this.logRootPath);
            }
            if (!fs.existsSync(this.debugFilePath)) {
                fs.mkdirSync(this.debugFilePath);
                fs.openSync(this.debugFilePath + '/debug.log', "w");
            }
            if (!fs.existsSync(this.exceptionFilePath)) {
                fs.mkdirSync(this.exceptionFilePath);
                fs.openSync(this.exceptionFilePath + '/exception.log', "w");
            }
        } catch(err) {
            return err;
        }

        return true;
    }

    getDebugFilePath(){
        return this.debugFilePath+ '/debug.log';
    }

    getExceptionFilePath(){
        return this.exceptionFilePath+ '/exception.log';
    }
}


//'./server/log/debug/debug.log'
//'./server/log/exception/exception.log'
let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: new LogFiles().getDebugFilePath(), json: true })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({ json: false, timestamp: true }),
        new winston.transports.File({ filename: new LogFiles().getExceptionFilePath(), json: false })
    ],
    exitOnError: false

})


module.exports = { logger, log: new LogFiles() };