# markdown-it-jsx

Plugin for [markdown-it](https://github.com/markdown-it/markdown-it)
to embed React/JSX components (and therefore JavaScript code) instead
of raw HTML.

## Install

```
$ npm install markdown-it-jsx --save
```

## Use

``` javascript
var md = require('markdown-it')();
var jsx = require('markdown-it-jsx');

md.use(jsx);
md.render(`
  
`);
```

## Prior work

mostly rely on Babel

_statically compile_
