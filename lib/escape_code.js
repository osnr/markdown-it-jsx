'use strict'

module.exports = function escape_code(default_renderer) {
  return function escape_renderer(tokens, idx, options, env, slf) {
    tokens[idx].content = '{`' + tokens[idx].content.replace(/`/g, '\\\`') + '`}'

    return default_renderer(tokens, idx, options, env, slf)
      .replace(/class="/g, 'className="');
  };
}