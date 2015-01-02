var express = require('express');
var log = require('./logger')(module);
var config = require('./config');

/**
 * Start server in output directory
 */
function serve() {
    log.info('Starting server');

    var app = express();
    app.use(express.static(config.get('output')));

    var host = config.get('server:host');
    var port = config.get('server:port');

    app.listen(port, host, function(err) {
        if(err) {
            log.error('Error occurred while starting server (%s)', err.message);
            process.exit(1);
        }
    });

    log.info('Server started at %s:%s', host, port);
}

exports.run = serve;
