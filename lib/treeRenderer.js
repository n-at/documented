var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var swig = require('swig');
var marked = require('marked');
var log = require('./logger')(module);
var config = require('./config');

var tree = null;
var docConfig = null;

function render(documentationTree, documentationConfig) {
    log.info('Rendering documentation tree');

    var outputPath = config.get('output');
    tree = documentationTree;
    docConfig = documentationConfig;

    renderSubtree(documentationTree, outputPath);

    log.info('Documentation tree rendering finished');
}

/**
 * Render subtree in target path
 * @param subtree
 * @param targetPath
 */
function renderSubtree(subtree, targetPath) {
    subtree.current = true;

    var i;

    //render documents
    for(i = 0; i < subtree.documents.length; i++)  {
        var document = subtree.documents[i];
        var name = (('alias' in document.meta) ? document.meta['alias'] : document.name) + '.html';
        var documentPath = path.join(targetPath, name);
        renderDocument(document, documentPath);
    }

    //create subdirectories
    for(i = 0; i < subtree.subtrees.length; i++) {
        var sub = subtree.subtrees[i];
        var subPath = path.join(targetPath, sub.name);
        try {
            fse.ensureDirSync(subPath);
        } catch(err) {
            log.error('Error occurred while creating directory "%s" (%s)', subPath, err.message);
            process.exit(1);
        }
        renderSubtree(sub, subPath);
    }

    subtree.current = false;
}

/**
 * Render document in target path
 * @param document
 * @param targetPath
 */
function renderDocument(document, targetPath) {
    //TODO this is a stub. Implement actual rendering
    try {
        fs.writeFileSync(targetPath, document.content);
    } catch(err) {
        log.error('Error occurred while writing file "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }
}

/**
 * Remove potentially dangerous characters from name
 * @param name
 */
function makeUrlSafeName(name) {
    return name.replace(/\.|\/|\\|&|\?|=|\[|\]|#|\s/g, '_'); //replace . / \ & ? = [ ] # with _
}

exports.render = render;
