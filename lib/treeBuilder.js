var fs = require('fs');
var uuid = require('node-uuid');
var path = require('path');
var log = require('./logger')(module);

var processedDocuments = 0;
var processedDirectories = 0;

/**
 * Build entire documentation tree
 * @param targetPath
 */
function buildTree(targetPath) {
    log.info('Building documentation tree');

    var tree = processDirectory(targetPath);

    log.info('Processed directories: %d', processedDirectories);
    log.info('Processed documents: %d', processedDocuments);

    if(!tree.hasIndex) {
        log.warn('Documentation tree has no root index.md');

        //create empty index
        tree.hasIndex = true;
        tree.documents.push({
            id: tree.id,
            name: 'index',
            meta: {},
            content: ''
        });
    }

    return tree;
}

/**
 * Build documentation tree for specified directory
 * @param targetPath
 */
function processDirectory(targetPath) {
    processedDirectories++;

    var tree = {
        id: uuid.v4(),
        name: path.basename(targetPath),
        title: path.basename(targetPath),
        hasIndex: false,
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

    var indexFound = false;

    for(var i = 0; i < files.length; i++) {
        var fileName = files[i];

        if(fileName.charAt(0) == '.') continue; //skip file names starting with dot

        var filePath = path.join(targetPath, fileName);
        if(getStat(filePath).isDirectory()) {
            var subtree = processDirectory(filePath);
            if(subtree.subtrees.length || subtree.documents.length) { //ignore empty directories
                tree.subtrees.push(subtree);
            }
            continue;
        }

        if(!isDocument(fileName)) continue;

        var document = parseDocument(filePath);

        if(fileName == 'index.md') {
            indexFound = true;
            tree.id = document.id;
            if('alias' in document.meta) { //index can override directory name
                tree.name = document.meta.alias;
            }
            if('title' in document.meta) { //index can override directory title
                tree.title = document.meta.title;
            } else {
                log.warn('Directory "%s" has no title defined in index.md', targetPath);
            }
            if('has_index' in document.meta) {
                tree.hasIndex = document.meta.has_index.toUpperCase() == 'TRUE';
            } else {
                tree.hasIndex = true;
            }
        }

        tree.documents.push(document);
    }

    if(!indexFound) log.warn('No index.md found in directory "%s"', targetPath);

    return tree;
}

/**
 * Documentation file parsing
 * Read file contents and parse metadata section
 * @param filePath
 */
function parseDocument(filePath) {
    processedDocuments++;
    var fileName = path.basename(filePath);
    var document = {
        id: uuid.v4(),
        name: fileName.substr(0, fileName.length-3), //file name without extension
        meta: {},
        content: ''
    };

    var content = '';
    try {
        content = fs.readFileSync(filePath, {encoding: 'utf8'});
    } catch(err) {
        log.error('Error occurred while reading file "%s" (%s)', filePath, err.message);
        process.exit(1);
    }

    var metaDelimiterPos = content.indexOf('---');
    if(metaDelimiterPos != -1) {
        document.content = content.substr(metaDelimiterPos+3).trim();
        document.meta = parseMetadata(content.substr(0, metaDelimiterPos), filePath);
    } else {
        log.warn('Metadata section not found in file "%s"', filePath);
        document.content = content;
    }

    return document;
}

/**
 * Extract document metadata from string
 * Metadata item format is <name>:<value>
 * @param meta
 * @param filePath
 * @returns {{}}
 */
function parseMetadata(meta, filePath) {
    var metaData = {};
    var metaItems = meta.split('\n'); //each item is on its own line
    for(var i = 0; i < metaItems.length; i++) {
        var metaItem = metaItems[i].trim();

        if(metaItem.length === 0) continue;

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

/**
 * Check what given file name matches acceptable document types
 * @param fileName
 */
function isDocument(fileName) {
    return fileName.match(/.md$/i); //get only *.md files (ignore extension case)
}

exports.build = buildTree;
