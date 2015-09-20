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
    copyExternalComponents();

    //documented components
    log.info('Copying documented components');
    var outputComponentsPath = path.join(outputPath, 'res');
    var documentedComponentsPath = path.join(outputComponentsPath, 'documented');
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
 * Copy extrnal (bower) components to site res directory
 */
function copyExternalComponents() {
    var components = {
        'bootstrap': {
            'css': ['bootstrap/dist/css/bootstrap.min.css'],
            'fonts': [
                'bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
                'bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
                'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
                'bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
                'bootstrap/dist/fonts/glyphicons-halflings-regular.woff2'
            ],
            'js': ['bootstrap/dist/js/bootstrap.min.js']
        },
        'jquery': ['jquery/dist/jquery.min.js'],
        'highlight.js': ['highlightjs/styles'],
        'modernizr': ['modernizr/modernizr.js']
    };

    var componentsPath = config.get('components_path');
    var outputComponentsPath = path.join(config.get('output'), 'res');

    /**
     * Copy resources to certain path
     * @param outputPath path relative to components path
     * @param files file names array to copy
     */
    var copyResources = function(outputPath, files) {
        for(var fileIdx = 0; fileIdx < files.length; fileIdx++) {
            var fileName = files[fileIdx];
            var filePath = path.join(componentsPath, fileName);

            if(!fs.existsSync(filePath)) {
                log.warn('Component file "' + fileName + '" does not exist');
                continue;
            }

            var fileOutputPath = path.join(outputComponentsPath, outputPath);
            try {
                fse.ensureDirSync(fileOutputPath);
            } catch(err) {
                terminate('Error occurred while creating component directory: ' + fileOutputPath, err);
            }

            try {
                fileOutputPath = path.join(fileOutputPath, path.basename(fileName));
                fse.copySync(filePath, fileOutputPath);
            } catch(err) {
                terminate("Error occurred while copying component file " + fileName, err);
            }
        }
    };

    /**
     * Process components hash
     * @param componentsHash
     * @param componentsPath
     */
    var processComponents = function(componentsHash, componentsPath) {
        for(var component in componentsHash) {
            if(componentsHash.hasOwnProperty(component)) {
                var subComponents = componentsHash[component];
                var subComponentsPath = path.join(componentsPath, component);
                if(subComponents instanceof Array) {
                    copyResources(subComponentsPath, subComponents);
                } else {
                    processComponents(subComponents, subComponentsPath);
                }
            }
        }
    };

    processComponents(components, '');
}

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
