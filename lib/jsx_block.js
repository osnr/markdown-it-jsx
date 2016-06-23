// JSX block.
// Based on https://github.com/markdown-it/markdown-it/blob/9074242bdd6b25abf0b8bfe432f152e7b409b8e1/lib/rules_block/html_block.js

'use strict';


var block_names = require('markdown-it/lib/common/html_blocks');

var jsx_parser = require('./jsx_parser');
var JSX_OPEN_TAG_PARSER = jsx_parser.JSX_OPEN_TAG_PARSER;
var JSX_SELF_CLOSE_TAG_PARSER = jsx_parser.JSX_SELF_CLOSE_TAG_PARSER;
var JSX_CLOSE_TAG_PARSER = jsx_parser.JSX_CLOSE_TAG_PARSER;

module.exports = function jsx_block(state, startLine, endLine, silent) {
  var pos = state.bMarks[startLine] + state.tShift[startLine];

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  var text = state.src.slice(pos);
  var result = JSX_OPEN_TAG_PARSER.parse(text);
  return result.status;

  // Let's roll down till block end.
  while (!JSX_CLOSE_TAG_PARSER.parse(text).status && !JSX_SELF_CLOSE_TAG_PARSER.parse(text).status) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      if (JSX_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) { nextLine++; }
        break;
      }
    }
  }

  var endLine = state.line + result.value.end.line;
  state.line = endLine;

  var token = state.push('jsx_block', '', 0);
  token.map = [ startLine, endLine ];
  token.content = state.getLines(startLine, endLine, state.blkIndent, true);

  return true;
};
