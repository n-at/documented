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
        nodes: [],
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

        var node = parseFile(filePath);

        if(fileName == 'index.md') {
            //TODO special case: process meta in index.md node
        }

        tree.nodes.push(node);
    }

    return tree;
}

/**
 * Documentation file parsing
 * @param filePath
 */
function parseFile(filePath) {
    var fileName = path.basename(filePath);
    var node = {
        name: fileName.substr(0, -3), //file name without extension
        meta: {},
        content: ''
    };

    //TODO read meta and content

    return node;
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
