var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var deepcopy = require('deepcopy');
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

    //prepare marked
    marked.setOptions({
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });

    //build menu
    documentationMenu = buildMenu(tree, '');

    var outputPath = config.get('output');
    renderSubtree(documentationTree, outputPath, 0);

    log.info('Documentation tree rendering finished');
}

/**
 * Render subtree in target path
 * @param subtree
 * @param targetPath
 * @param level Depth of subtree in hierarchy
 */
function renderSubtree(subtree, targetPath, level) {
    var i;

    //render documents
    for(i = 0; i < subtree.documents.length; i++)  {
        var document = subtree.documents[i];
        var documentName = getDocumentName(document);
        var documentPath = path.join(targetPath, documentName);
        renderDocument(document, documentPath, level);
    }

    //create subdirectories
    for(i = 0; i < subtree.subtrees.length; i++) {
        var sub = subtree.subtrees[i];
        var subPath = path.join(targetPath, makeUrlSafeName(sub.name));
        try {
            fse.ensureDirSync(subPath);
        } catch(err) {
            log.error('Error occurred while creating directory "%s" (%s)', subPath, err.message);
            process.exit(1);
        }
        renderSubtree(sub, subPath, level+1);
    }
}

/**
 * Render document in target path
 * @param document
 * @param targetPath
 * @param level Depth of document in hierarchy
 */
function renderDocument(document, targetPath, level) {
    var outputDocument = deepcopy(document);

    //prepare relative url path
    outputDocument.relativeUrlPath = (new Array(level+1)).join('../');

    //prepare document menu
    var documentMenu = deepcopy(documentationMenu);
    markCurrentMenuItems(documentMenu, document.id);

    //render markdown
    var renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        var externalUrlPattern = /^https?:\/\//i;
        if(!externalUrlPattern.test(href)) {
            href = outputDocument.relativeUrlPath + 'img/' + href;
        }
        title = title ? title : '';
        return '<img src="'+href+'" title="'+title+'" alt="'+text+'">';
    };
    try {
        outputDocument.content = marked(document.content, {renderer: renderer});
    } catch(err) {
        log.error('Error occurred while rendering content of page "%s" (%s)', targetPath, err.message);
        process.exit(1);
    }

    //render swig template
    var pageContent = '';
    try {
        pageContent = compiledPageTemplate({
            config: docConfig,
            menu: documentMenu,
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
 * @param currentPath current url path (ends with /)
 */
function buildMenu(subtree, currentPath) {
    var menu = {
        id: subtree.id,
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
        var menuPath = currentPath + makeUrlSafeName(sub.name) + '/';
        menu.submenus.push(buildMenu(sub, menuPath));
    }

    //documents
    for(i = 0; i < subtree.documents.length; i++) {
        var document = subtree.documents[i];
        if(document.name == 'index') continue; //exclude index pages from menu
        var documentName = getDocumentName(document);
        var documentPath = currentPath + documentName;
        menu.items.push({
            title: ('title' in document.meta) ? document.meta.title : document.name,
            path: documentPath,
            id: document.id
        });
    }

    return menu;
}

/**
 * Mark current menu items
 * @param submenu
 * @param currentId
 */
function markCurrentMenuItems(submenu, currentId) {
    //check sub menu itself
    if(submenu.id == currentId) {
        submenu.current = true;
        return true;
    }

    var i;

    //check items
    for(i = 0; i < submenu.items.length; i++) {
        var item = submenu.items[i];
        if(item.id == currentId) {
            item.current = true;
            submenu.current = true;
            return true;
        }
    }

    //check sub menus
    for(i = 0; i < submenu.submenus.length; i++) {
        var sub = submenu.submenus[i];
        if(markCurrentMenuItems(sub, currentId)) {
            submenu.current = true;
            return true;
        }
    }

    return false;
}

/**
 * Remove potentially dangerous characters from name
 * @param name
 */
function makeUrlSafeName(name) {
    return name.replace(/\.|\/|\\|&|\?|=|\[|\]|#|\s/g, '_'); //replace . / \ & ? = [ ] # with _
}

/**
 * Get safe document name for URL
 * @param document
 * @returns {string}
 */
function getDocumentName(document) {
    var documentName = ('alias' in document.meta) ? document.meta.alias : document.name;
    if(document.name == 'index') documentName = 'index';
    return makeUrlSafeName(documentName) + '.html';
}

exports.render = render;
