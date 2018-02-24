# markdown-it-jsx

Plugin for [markdown-it](https://github.com/markdown-it/markdown-it)
to embed React/JSX components (and therefore JavaScript code) instead
of raw HTML.

Meant as part of larger system [TODO].

When rendering, the JSX (including both tags and braced JS
expressions) is passed through verbatim to the output: this plugin is
basically just a minimal recognizer, intended to keep markdown-it from
messing up JSX tags or interpolated JavaScript spans by treating them
as Markdown.

*Note: if you render Markdown with JSX in it, the output won't be valid HTML
anymore (since it may have React component tags, embedded JavaScript,
etc); instead, it'll have to be rendered by React first.*

## Install

```
$ npm install markdown-it markdown-it-jsx --save
```

## Use

```javascript
var md = require('markdown-it')();
var jsx = require('markdown-it-jsx');
md.use(jsx);

console.log(md.render(`
# A sample document

Two times three is <Doubler>{3}</Doubler>.

We can <em>intermix **Markdown** and JSX.</em>

The current date is {new Date().toString()}.

Some {"[link](/link)"} that will not be rendered.

`));
```

prints this JSX output

```jsx
<h1>A sample document</h1>
<p>Two times three is <Doubler>{3}</Doubler>.</p>
<p>We can <em>intermix <strong>Markdown</strong> and JSX.</em></p>
<p>The current date is {new Date().toString()}.</p>
<p>Some {"[link](/link)"} that will not be rendered.</p>
```

which isn't quite a valid JSX expression, but will
be if you wrap it in an outer `<div>` and `</div>`.

The `<em>` is now actually treated as JSX and not HTML, even though
it's also a standard HTML tag and would be treated as HTML by a normal
Markdown parser.

Again, the render output is not valid HTML in itself -- you'll
probably want to wrap a React component declaration around that outer
`<div>`, run that through Babel or TypeScript to make it runnable JS,
then use React to actually render the component to a browser
DOM. (Here, you'd need to define the `Doubler` component, too.)

See [example/render.js](example/render.js) for a more complete example
of writing a document and then rendering it (offline, in that case).

See [TODO] for an even bigger, in-browser, dynamic example.

## Implementation

I'm using
[parsimmon parser combinators](https://github.com/jneen/parsimmon) in
the [JSX matcher](lib/jsx_parser.js) instead of the regexes in the
original
[HTML matcher](https://github.com/markdown-it/markdown-it/blob/9074242bdd6b25abf0b8bfe432f152e7b409b8e1/lib/common/html_re.js),
to scan over braced expressions for embedded JS. This is probably
excessive, and a for loop with a state variable would suffice. The
behavior is also not really correct (what about braces inside string
literals in JS?), but good enough for now.

The render rule in [index.js](index.js) just passes the JSX code string
straight through into the rendered output; the parser doesn't construct
a coherent AST of the JSX or anything.

There's a hack for JSX blocks (like
[HTML blocks](http://spec.commonmark.org/0.25/#html-blocks) in
standard Markdown); if we see a paragraph with JSX tags at its open
and end, we remove the paragraph open and end, effectively promoting
the JSX inside. Again, not really correct, and will treat some things
differently from CommonMark spec, but good enough.

## Changelog

- 1.1.0: Merged PRs from Xiphe: update dependencies, treat contents of
  backtick code inlines/fenced blocks as literal JS strings (so braces
  aren't annoying in code samples, for example).
- 1.0.0: Initial release.

## See also

Similar things and classes of things:

- Andrey Popp's [Reactdown](https://andreypopp.github.io/reactdown/)
  was the first I saw, in its
  [iteration from 2014](https://github.com/andreypopp/reactdown/tree/prev). The
  old version was pretty similar but had a less reliable Markdown
  parser, I think. The new version seems to abandon the JSX
  syntax. Very much worth looking at, though.
- [mdreact](https://github.com/funkjunky/mdreact) also appears similar
  but also abandons JSX syntax, and it looks a little unreliable.
- [react-showdown](https://github.com/jerolimov/react-showdown) can
  only generate the React component as a runtime object, not as JSX
  source; it's not a static compilation pipeline.
- [rexxars/react-markdown](https://github.com/rexxars/react-markdown) and some
  others render ordinary Markdown to React components, but don't let
  you embed React components in the Markdown (since that would make
  the output a component instead of a static element tree)
- [sunflowerdeath/react-markdown](https://github.com/sunflowerdeath/react-markdown)
  and some others provide a React component that renders children or
  props as React components. Again, can't actually embed custom tags
  in the Markdown.
- [markdown-component-loader](https://www.npmjs.com/package/markdown-component-loader)
  (recent) looks pretty good at a glance. Slightly heavier
  double-brace syntax. Also, a Webpack loader, so very build-system-y
  instead of just being a markdown-it plugin?

Things I wanted from this syntax extension:

- Use arbitrary React components inside Markdown document. (This
  plugin alone doesn't deal with scoping and defining names used in
  your JSX, though. See [TODO] for one solution to that issue.)
- Use standard JSX syntax inside Markdown document.
- Statically compile Markdown+JSX source to JavaScript React component
  source.
