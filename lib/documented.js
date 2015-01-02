var log = require('./logger')(module);
var config = require('./config');
var generator = require('./generator');

exports.run = function() {
    var documentedPackage = require('../package.json');
    log.info('documented ' + documentedPackage.version);

    getCommandlineConfig();

    generator.generate();

    if(config.get('action:serve')) {
        require('./server').run();
    }
};

/**
 * Read configuration from command line
 */
function getCommandlineConfig() {
    var optimist = require('optimist')
        .usage('Usage: $0 build|serve --docs=[path] --images=[path] --output=[path]')
        .options('docs', {
            alias: 'd',
            default: './docs',
            description: 'Documents path'
        })
        .options('images', {
            alias: 'i',
            default: './docs/img',
            description: 'Images path'
        })
        .options('output', {
            alias: 'o',
            default: './site',
            description: 'Output path'
        })
        .options('host', {
            alias: 'h',
            default: '0.0.0.0',
            description: 'Built-in server host'
        })
        .options('port', {
            alias: 'p',
            default: '4000',
            description: 'Built-in server port'
        })
        .options('log_level', {
            default: 'info',
            description: 'Severity of messages to put into log'
        });

    var argv = optimist.argv;
    var build = argv._.indexOf('build') != -1;
    var serve = argv._.indexOf('serve') != -1;

    if(!build && !serve) {
        optimist.showHelp();
        console.log('Action required: build|serve');
        process.exit(1);
    }

    //apply options
    config.set('log_level', argv.log_level);
    config.set('docs', argv.docs);
    config.set('img', argv.images);
    config.set('output', argv.output);
    config.set('server:host', argv.host);
    config.set('server:port', argv.port);
    config.set('action:build', build);
    config.set('action:serve', serve);
}
