title: How to use documented
---

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

* `title`: title (file name without extension by default)
* `alias`: name in the URL (file name by default)
* `author`: author (can be omitted)
* `date`: date of creation or modification (can be omitted)

Document metadata example:

    title: Example page
    alias: example_page_alias
    date: 21.12.2014
    author: John Doe
    ---

Index file (`index.md`) metadata defines directory attributes:
 
* `title`: name in the menu
* `alias`: name in the URL (file system directory name by default)
* `has_index`: when equals to `false`, index.html page will not be generated
  
Metadata section ends with line containing only `---` (three dashes).
  
Documentation configuration is stored in the `config.json` file inside of documentation root directory. Here you 
can define:
 
* `title`: the entire documentation title
* `theme`: documentation visual theme name (theme.less file name without extension from 
  [documented built-in themes](https://github.com/n-at/documented/tree/master/res/less/themes))
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
          "Visit GitHub repository": "http://github.com/n-at/documented",
          "NPM package page": "https://www.npmjs.com/package/documented"
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
