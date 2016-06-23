// Process JSX tags.
// Based on https://github.com/markdown-it/markdown-it/blob/9074242bdd6b25abf0b8bfe432f152e7b409b8e1/lib/rules_inline/html_inline.js

'use strict';


var JSX_INLINE_PARSER = require('./jsx_parser').JSX_INLINE_PARSER;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function jsx_inline(state, silent) {
  var result, max, token,
      pos = state.pos;

  // Check start
  max = state.posMax;
  var firstCh = state.src.charCodeAt(pos);
  if ((firstCh !== 0x3C/* < */ &&
       firstCh !== 0x7B/* { */) ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char if < was first char
  var secondCh = state.src.charCodeAt(pos + 1);
  if (secondCh === 0x3C/* < */ &&
      (secondCh !== 0x21/* ! */ &&
       secondCh !== 0x3F/* ? */ &&
       secondCh !== 0x2F/* / */ &&
       !isLetter(secondCh))) {
    return false;
  }

  result = JSX_INLINE_PARSER.parse(state.src.slice(pos));

  if (!result.status) { return false; }

  if (!silent) {
    token         = state.push('jsx_inline', '', 0);
    token.content = state.src.slice(pos, pos + result.value.end.offset);
  }

  state.pos += result.value.end.offset;
  return true;
};
