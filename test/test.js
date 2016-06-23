var MarkdownIt = require('markdown-it');
var md = MarkdownIt().use(require('..'));

var path = require('path');
var testgen = require('markdown-it-testgen');

describe('markdown-it-jsx', function() {
  var test = function(filename) {
    testgen(path.join(__dirname, 'fixtures', filename), { header: true }, md);
  };

  test('basic.txt');
  test('inline.txt');
  test('block.txt');
});
