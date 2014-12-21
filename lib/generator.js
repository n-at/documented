var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var treeBuilder = require('./treeBuilder');
var treeRenderer = require('./treeRenderer');
var log = require('./logger')(module);
var config = require('./config');

exports.generate = function() {
    log.info('Starting generation');

    //get documentation config
    var documentationConfig = null;
    try {
        documentationConfig = fse.readJSONFileSync(path.join(config.get('docs'), 'config.json'));
    } catch(err) {
        terminate('Error occurred while opening documentation configuration', err);
    }

    //build documentation tree
    var tree = treeBuilder.build(config.get('docs'));

    //check output path
    var outputPath = config.get('output');
    log.info('Output directory: %s', outputPath);
    if(fs.existsSync(outputPath)) {
        log.info('Output directory exists. Removing');
        try {
            fse.removeSync(outputPath);
        } catch(err) {
            terminate('Error occurred while removing previous output', err);
        }
    }

    //create output directory
    log.info('Creating output directory');
    try {
        fse.ensureDirSync(outputPath);
    } catch(err) {
        terminate('Error occurred white creating output directory', err);
    }

    //copy components
    log.info('Copying components');
    var componentsPath = config.get('components_path');
    var outputComponentsPath = path.join(outputPath, 'res');
    if(!fs.existsSync(componentsPath)) {
        terminate('Components directory does not exist. Install components with bower');
    }
    try {
        fse.copySync(componentsPath, outputComponentsPath);
    } catch(err) {
        terminate('Error occurred while copying components', err);
    }

    //documented components
    log.info('Copying documented components');
    var documentedComponentsPath = path.join(componentsPath, 'documented');
    try {
        fse.copySync(config.get('res_path'), documentedComponentsPath);
    } catch(err) {
        terminate('Error occurred while copying documented components', err);
    }

    //copy images
    if(fs.existsSync(config.get('img'))) {
        log.info('Copying images');
        try {
            fse.copySync(config.get('img'), path.join(outputPath, 'img'));
        } catch(err) {
            terminate('Error occurred while copying images', err);
        }
    }

    treeRenderer.render(tree, documentationConfig);

    log.info('Generation finished');
};

/**
 * Terminate process execution
 * @param message Error message to write into log
 * @param err Optional Error object
 */
function terminate(message, err) {
    if(err) message += ' (' + err.message + ')';
    log.error(message);
    process.exit(1);
}
