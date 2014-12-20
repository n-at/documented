documented
----------

_Simple documentation generator inspired by [daux.io](http://daux.io) and [jekyll](http://jekyllrb.com)._

## Installation

Install [node.js](http://nodejs.org) first. 

Clone this repository and run in shell:

    $ npm install
    $ bower install

## Usage

To just generate the documentation, run in shell:
    
    $ node documented.js
    
documented also have built-in web server. To start it, run in shell:

    $ node documented.js serve
    
And navigate your browser to http://localhost:4000 (by default, you can change port in the configuration file).

## Creating documentation

By default, documented will look for documentation in the `docs` directory. This directory already contains some
example documents. documented will put generated documentation into `site` directory. You can change documentation 
and output directories in the configuration file.

documented will process only markdown files (with `.md` extension), other will be ignored. If you want to know more 
about markdown syntax, visit the GitHub [help page](https://help.github.com/articles/markdown-basics/).

Each directory should contain an `index.md` file. Documents and directories in the menu will be sorted by their 
names in the file system.

Each document file should contain metadata section. This section contains several text lines in the `<name>:<value>` 
format. Metadata will define document attributes:

* `title`: document title (file name by default)
* `alias`: document name in the URL (file name by default)
* `author`: document author (can be omitted)
* `date`: document date of creation or modification (can be omitted)

Index file metadata define directory attributes:
 
* `title`: directory name in the menu
* `alias`: directory name in the URL (file system directory name by default)
* `has_index`: when equals to `false`, index.html page will not be generated
  
Metadata section ends with line containing `---`.
  
Documentation configuration is stored in the `config.json` file inside of documentation root directory. Here you 
can define:
 
* `title`: entire documentation title
* `theme`: documentation visual theme name (css file name without extension from `/res/themes`)
* `highlight`.`style`: source code highlight style name (css file name without extension from 
  `/components/highlight.js/src/styles/`)
* `links`: custom links to include in the bottom bar
    
## Configuration

documented configuration is stored in the `config.json` file in the root directory. Here you can change:

* `log_level`: severity of messages to put into log (`debug`, `info`, `warn` and `error`)
* `docs`: documentation root directory
* `img`: documentation images directory
* `output`: directory to put generated documentation
* `server_port`: port for built-in web server
* `server_host`: host for built-in web server. Set to `0.0.0.0` for accepting all connections or `127.0.0.1` for 
  local connections only

## License

Copyright (c) 2014, Alexey Nurgaliev. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the 
   following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the 
   following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote 
   products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE 
USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
