// A simple 'compiler' that uses the plugin.
// Run at command-line with `node render.js`.

// Has a fixed sample Markdown/JSX document, which gets fed into
// markdown-it + markdown-it-jsx to convert it to JSX.

// Then the JSX is fed into Babel to convert it to ordinary JS which
// Node can actually run. (Node doesn't support JSX syntax.)

// Then we eval that ordinary JS to construct the React component `Document`.

// Finally, we render <Document /> as static HTML to show you how it'd
// look (you might put that in an html file and look at it in a browser).

// Other DOM states might exist for other models, but this is a simple
// example that shows you the whole Markdown -> rendering pipeline
// without us needing to use a browser.

var md = require('markdown-it')();
var jsx = require('..');
md.use(jsx);

// We'll define the Doubler component later, when we're about to execute
// this document.
var documentSource = `
# A sample document

Two times three is <Doubler>{3}</Doubler>.

We can <em>intermix **Markdown** and JSX.</em>

The current date is {new Date().toString()}.
`;

var markdownCompileResult = md.render(documentSource);
// Now markdownCompileResult is a series of JSX tags concatenated together.
// Should be something like:
//
//     <h1>A sample document</h1>
//     <p>Two times three is <Doubler>{3}</Doubler>.</p>
//     <p>We can <em>intermix <strong>Markdown</strong> and JSX.</em></p>
//     <p>The current date is {new Date().toString()}.</p>

// Next, the JSX -> raw JS compilation with Babel.
var babel = require('babel-core');

var babelCompileResult = babel.transform(
  // We need to wrap the JSX in a div so it's a valid JSX expression.
  '() => (<div>' + markdownCompileResult + '</div>)',
  { presets: ['react'] }
).code;

// Finally, import React and friends and actually execute that JS code.
var React = require('react');
var ReactDOMServer = require('react-dom/server');

var Doubler = function(props) {
  return React.createElement('span', null, 2 * props.children);
};

var Document = eval(babelCompileResult);
// Now Document is a React component, which might be instantiated with <Document />
// in JSX syntax.

// Print out a concrete rendering of the document as static HTML.
console.log(ReactDOMServer.renderToStaticMarkup(React.createElement(Document)));
// Should be something like:
// 
//     <div><h1>A sample document</h1><p>Two times three is <span>6</span>.</p>
//     <p>We can <em>intermix <strong>Markdown</strong> and JSX.</em></p>
//     <p>The current date is Thu Jun 23 2016 22:25:54 GMT-0700 (PDT).</p></div>
