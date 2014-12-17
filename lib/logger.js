var winston = require('winston');
var path = require('path');
var config = require('./config');

function getLogger(module) {
    var moduleName = module.filename.split(path.sep).slice(-2).join('/');
    if(!(module.filename in winston.loggers)) {
        var logLevel = config.get('log_level');
        //create new logger
        winston.loggers.add(module.filename, {
            console: {
                colorize: true,
                level: logLevel,
                label: moduleName
            }
        });
    }
    return winston.loggers.get(module.filename);
}
module.exports = getLogger;
