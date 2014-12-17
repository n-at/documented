var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var log = require('./logger')(module);
var config = require('./config');

/**
 * Build documentation tree for specified directory
 * @param targetPath
 */
function processDirectory(targetPath) {
    var tree = {
        name: path.basename(targetPath),
        documents: [],
        subtrees: []
    };

    //directory files list
    var files = [];
    try {
        files = fs.readdirSync(targetPath);
        files.sort();
    } catch(err) {
        log.error('Error occurred while processing directory "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }

    for(var i = 0; i < files.length; i++) {
        var fileName = files[i];

        var filePath = path.join(targetPath, fileName);
        if(getStat(filePath).isDirectory()) {
            tree.subtrees.push(processDirectory(filePath));
            continue;
        }

        if(!fileName.match(/\.md$/)) continue; //get only *.md files

        var document = parseDocument(filePath);

        if(fileName == 'index.md' && ('alias' in document.meta)) { //index can override directory name
            tree.name = document.meta['alias'];
        }

        tree.documents.push(document);
    }

    return tree;
}

/**
 * Documentation file parsing
 * @param filePath
 */
function parseDocument(filePath) {
    var fileName = path.basename(filePath);
    var document = {
        name: fileName.substr(0, fileName.length-3), //file name without extension
        meta: {},
        content: ''
    };

    try {
        var content = fs.readFileSync(filePath, {encoding: 'utf8'});
    } catch(err) {
        log.error('Error occurred while reading file "%s" (%s)', filePath, err.message);
        process.exit(1);
    }

    var metaDelimiterPos = content.indexOf('---');
    if(metaDelimiterPos != -1) {
        document.content = content.substr(metaDelimiterPos+3);
        document.meta = parseMetadata(content.substr(0, metaDelimiterPos), filePath);
    } else {
        log.warn('Metadata not found in file "%s"', filePath);
        document.content = content;
    }

    return document;
}

/**
 * Extract document metadata from string
 * Meta format is <name>:<value>
 * @param meta
 * @param filePath
 * @returns {{}}
 */
function parseMetadata(meta, filePath) {
    var metaData = {};
    var metaItems = meta.split('\n');
    for(var i = 0; i < metaItems.length; i++) {
        var metaItem = metaItems[i];

        var colonPos = metaItem.indexOf(':');
        if(colonPos == -1) {
            log.warn('Incorrect meta on line %d in file "%s"', i+1, filePath);
            continue;
        }

        var name = metaItem.substr(0, colonPos).trim();
        if(name in metaData) {
            log.warn('Override meta with name "%s" in file "%s"', name, filePath);
        }

        metaData[name] = metaItem.substr(colonPos+1).trim();
    }
    return metaData;
}

/**
 * Get file stat
 * @param path
 * @returns {*}
 */
function getStat(path) {
    try {
        return fs.statSync(path);
    } catch(err) {
        log.error('Error occurred while getting info about "%s" (%s)', path, err.message);
        process.exit(1);
    }
}

exports.build = processDirectory;
