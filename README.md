documented
----------

_Simple documentation generator inspired by [daux.io](http://daux.io) and [jekyll](http://jekyllrb.com)._

[![NPM](https://nodei.co/npm/documented.png?downloads=true&downloadRank=true)](https://nodei.co/npm/documented)

## Installation

documented requires [node.js with npm](http://nodejs.org). 

### From npm

Best option is installation from [npm](https://www.npmjs.com/). Run in shell:

    $ npm install documented -g
    
documented will be available in shell as

    $ documented
    
### From GitHub

Also you can install documented from GitHub. 

You need [git](http://git-scm.com/) and [bower](http://bower.io/).

Clone repository:

    $ git clone https://github.com/n-at/documented.git
    $ cd documented
 
Install code dependencies:

    $ npm install
    $ bower install
    
documented can be run from code directory:
 
    $ node documented
    
## Usage

To view available options, run:

    $ documented

To just generate the documentation, run:
    
    $ documented build
    
documented also has a built-in web server. To start it, run:

    $ documented serve
    
And navigate your browser to http://localhost:4000 (by default, you can change port with commandline options).

## Creating documentation

Example of generated documentation you can see at [GitHub project page](http://n-at.github.io/documented).

By default, documented will look for documentation in the `docs` directory and documentation images in the `docs/img`. 
[Here](https://github.com/n-at/documented/tree/master/docs) you can find some example documents. 
documented will put generated documentation into `site` directory. You can change documentation, images and output 
paths with commandline options.

documented will process only markdown files (with `.md` extension), other will be ignored. If you want to know more 
about markdown syntax, visit the GitHub [help page](https://help.github.com/articles/markdown-basics/).

Each directory should contain an `index.md` file.

Each document file should contain metadata section. This section contains several text lines in the `<name>:<value>` 
format. Metadata will define document attributes:

* `title`: document title (file name without extension by default)
* `alias`: document name in the URL (file name by default)
* `author`: document author (can be omitted)
* `date`: document date of creation or modification (can be omitted)

Document metadata example:

    title: Example page
    alias: example_page_alias
    date: 21.12.2014
    author: John Doe
    ---

Index file (`index.md`) metadata defines directory attributes:
 
* `title`: directory name in the menu
* `alias`: directory name in the URL (file system directory name by default)
* `has_index`: when equals to `false`, index.html page will not be generated
  
Metadata section ends with line containing only `---` (three dashes).
  
Documentation configuration is stored in the `config.json` file inside of documentation root directory. Here you 
can define:
 
* `title`: the entire documentation title
* `theme`: documentation visual theme name (css file name without extension from 
  [documented built-in themes](https://github.com/n-at/documented/tree/master/res/themes))
* `highlight`.`style`: source code highlight style name (css file name without extension from 
  `/components/highlight.js/src/styles/`)
* `links`: custom links to include to the bottom bar

Configuration example:

    {
      "title": "documented",
      "theme": "teal-dark",
      "highlight": {
        "style": "github"
      },
      "copyright": "documented is licensed under BSD",
      "links": {
        "GitHub": "http://github.com/n-at/documented",
        "twitter": "http://twitter.com/atnurgaliev"
      }
    }

Files and directories in the result documentation menu will be sorted by their names in the filesystem (or aliases).
It is recommended to give names (or aliases) which start with number and consist of latin letters, digits and 
underscores. For example:

    00_markdown.md
    01_syntax.md
    02_github.md

**Note for images.** Set path to image relative of images directory. For example, you have the image with name 
`img.png` in the root of images directory. In document you can insert it with code: `![example image](img.png)`.

## License

Copyright (c) 2014-2015, Alexey Nurgaliev. All rights reserved.

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
