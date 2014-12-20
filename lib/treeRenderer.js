var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var util = require('util');
var swig = require('swig');
var marked = require('marked');
var hljs = require('highlight.js');
var log = require('./logger')(module);
var config = require('./config');

var tree = null;
var docConfig = null;
var documentationMenu = null;
var compiledPageTemplate = null;

function render(documentationTree, documentationConfig) {
    log.info('Rendering documentation tree');

    tree = documentationTree;
    docConfig = documentationConfig;

    //compile template
    var pageTemplatePath = path.join(config.get('templates_path'), 'page.twig');
    compiledPageTemplate = swig.compileFile(pageTemplatePath);

    //prepare highlight.js
    hljs.configure({
        classPrefix: ''
    });

    //prepare marked
    marked.setOptions({
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    //build menu
    documentationMenu = buildMenu(tree, '');

    var outputPath = config.get('output');
    renderSubtree(documentationTree, outputPath);

    log.info('Documentation tree rendering finished');
}

/**
 * Render subtree in target path
 * @param subtree
 * @param targetPath
 */
function renderSubtree(subtree, targetPath) {
    var i;

    //render documents
    for(i = 0; i < subtree.documents.length; i++)  {
        var document = subtree.documents[i];
        var documentName = getDocumentName(document);
        var documentPath = path.join(targetPath, documentName);
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
}

/**
 * Render document in target path
 * @param document
 * @param targetPath
 */
function renderDocument(document, targetPath) {
    var outputDocument = util._extend(document, {}); //clone document

    //render markdown
    try {
        outputDocument.content = marked(document.content);
    } catch(err) {
        log.error('Error occurred while rendering content of page "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }

    //render swig template
    try {
        var pageContent = compiledPageTemplate({
            config: docConfig,
            menu: documentationMenu,
            document: outputDocument
        });
    } catch(err) {
        log.error('Error occurred while rendering page template for file "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }

    //write into file
    try {
        fs.writeFileSync(targetPath, pageContent);
    } catch(err) {
        log.error('Error occurred while writing file "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }
}

/**
 * Build menu by subtree
 * @param subtree
 * @param currentPath
 */
function buildMenu(subtree, currentPath) {
    var menu = {
        items: [],
        submenus: [],
        path: currentPath,
        title: subtree.title,
        hasIndex: subtree.hasIndex
    };

    var i;

    //sub menus
    for(i = 0; i < subtree.subtrees.length; i++) {
        var sub = subtree.subtrees[i];
        var menuPath = currentPath + '/' + makeUrlSafeName(sub.name);
        menu.submenus.push(buildMenu(sub, menuPath));
    }

    //documents
    for(i = 0; i < subtree.documents.length; i++) {
        var document = subtree.documents[i];
        if(document.name == 'index') continue; //exclude index pages from menu
        var documentName = getDocumentName(document);
        var documentPath = currentPath + '/' + documentName;
        menu.items.push({
            title: ('title' in document.meta) ? document.meta['title'] : document.name,
            path: documentPath,
            id: document.id
        });
    }

    return menu;
}

/**
 * Remove potentially dangerous characters from name
 * @param name
 */
function makeUrlSafeName(name) {
    return name.replace(/\.|\/|\\|&|\?|=|\[|\]|#|\s/g, '_'); //replace . / \ & ? = [ ] # with _
}

/**
 * Get document name for URL
 * @param document
 * @returns {string}
 */
function getDocumentName(document) {
    var documentName = ('alias' in document.meta) ? document.meta['alias'] : document.name;
    if(document.name == 'index') documentName = 'index';
    return makeUrlSafeName(documentName) + '.html';
}

exports.render = render;
