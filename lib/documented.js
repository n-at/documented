var log = require('./logger')(module);
var config = require('./config');
var generator = require('./generator');

exports.run = function() {
    var documentedPackage = require('../package.json');
    log.info('Starting documented ' + documentedPackage.version);

    generator.generate();
};
