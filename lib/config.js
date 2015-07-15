var nconf = require('nconf');
var path = require('path');

var rootPath = path.join(__dirname, '..');

nconf.use('memory');

//Paths
nconf.set('root_path', rootPath); //documented root
nconf.set('res_path', path.join(rootPath, 'res')); //resources
nconf.set('components_path', path.join(rootPath, 'components')); //bower components
nconf.set('templates_path', path.join(rootPath, 'templates')); //swig page templates

module.exports = nconf;
