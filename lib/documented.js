var log = require('./logger')(module);
var config = require('./config');
var generator = require('./generator');

exports.run = function() {
    var documentedPackage = require('../package.json');
    log.info('Starting documented ' + documentedPackage.version);

    generator.generate();

    if(process.argv.indexOf('serve') != -1) {
        require('server').run();
    } else {
        process.exit(0);
    }
};
