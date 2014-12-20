var nconf = require('nconf');
var path = require('path');

var rootPath = path.join(__dirname, '..');

//load config
nconf.file(path.join(rootPath, 'config.json'));

//set dir names in config
nconf.set('root_path', rootPath);
nconf.set('res_path', path.join(rootPath, 'res'));
nconf.set('components_path', path.join(rootPath, 'components'));
nconf.set('templates_path', path.join(rootPath, 'templates'));

module.exports = nconf;
