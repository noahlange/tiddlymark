import type { MatchFunction, ParserRule, State } from 'simple-markdown';
import { defaultRules as rules, blockRegex } from 'simple-markdown';

import type { JSONMLArrayRule, JSONMLOutputRule } from './utils';

import { parse, jsonml } from './lib';

interface Matcher extends MatchFunction {
  (source: string, state: State): RegExpExecArray | null;
  regex: RegExp;
}

function inline(regex: RegExp): Matcher {
  const match = (source: string, state: State): RegExpExecArray | null => {
    return state.inline ? regex.exec(source) : null;
  };
  match.regex = regex;
  return match;
}

function block(regex: RegExp): Matcher {
  const match = (source: string, state: State): RegExpExecArray | null => {
    return state.inline ? null : regex.exec(source);
  };
  match.regex = regex;
  return match;
}

export interface JSONMLRules {
  readonly Array?: JSONMLArrayRule;
  readonly [type: string]:
    | (ParserRule & JSONMLOutputRule)
    | JSONMLArrayRule
    | undefined;
}

const newRules: JSONMLRules = {
  Array: {
    ...rules.Array,
    jsonml: jsonml.array
  },
  heading: {
    ...rules.heading,
    match: block(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/),
    jsonml: jsonml.heading
  },
  br: {
    ...rules.br,
    jsonml: jsonml.tag('br')
  },
  hr: {
    ...rules.hr,
    jsonml: jsonml.tag('hr')
  },
  codeBlock: {
    ...rules.codeBlock,
    jsonml: jsonml.codeBlock
  },
  blockQuote: {
    ...rules.blockQuote,
    jsonml: jsonml.blockquote
  },
  tableSeparator: {
    ...rules.tableSeparator,
    jsonml: () => []
  },
  block: {
    match: blockRegex(/^ *(?::{3})\s?([^\n]*)\n{1,}([\s\S]+?)\s*(?::{3})/),
    // match: blockRegex(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),
    // match: blockRegex(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*(?:\1)/),
    order: rules.fence.order - 1,
    parse: parse.block,
    jsonml: jsonml.block
  },
  list: {
    ...rules.list,
    jsonml: jsonml.list
  },
  table: {
    ...rules.table,
    jsonml: jsonml.table
  },
  link: {
    ...rules.link,
    match: inline(
      /^\[((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*)\]\(\s*<?(.*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/
    ),
    jsonml: jsonml.link
  },
  image: {
    ...rules.image,
    match: inline(
      /^!\[((?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*)\]\(\s*<?(.*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/
    ),
    jsonml: jsonml.image
  },
  em: {
    ...rules.em,
    jsonml: jsonml.element('em')
  },
  strong: {
    ...rules.strong,
    jsonml: jsonml.element('strong')
  },
  u: {
    ...rules.u,
    jsonml: jsonml.element('u')
  },
  del: {
    ...rules.del,
    jsonml: jsonml.element('del')
  },
  ins: {
    ...rules.del,
    order: rules.del.order + 0.125,
    match: inline(/^\+\+((?:\\[\s\S]|[^\\])+?)\+\+(?!\+\+)/),
    jsonml: jsonml.element('ins')
  },
  sub: {
    ...rules.del,
    order: rules.del.order + 0.25,
    match: inline(/^~((?:\\[\s\S]|[^\\])+?)~(?!~)/),
    jsonml: jsonml.element('sub')
  },
  sup: {
    ...rules.del,
    order: rules.del.order + 0.5,
    match: inline(/^\^((?:\\[\s\S]|[^\\])+?)\^(?!\^)/),
    jsonml: jsonml.element('sup')
  },
  inlineCode: {
    ...rules.inlineCode,
    jsonml: jsonml.inlineCode
  },
  newline: {
    ...rules.newline,
    jsonml: () => '\n'
  },
  text: {
    ...rules.text,
    jsonml: jsonml.text
  },
  emoji: {
    ...rules.text,
    order: rules.text.order - 0.25,
    match: inline(/^:(\w+):/),
    parse: parse.emoji,
    jsonml: jsonml.emoji
  },
  paragraph: {
    ...rules.paragraph,
    jsonml: jsonml.element('p')
  },
  transcludeInline: {
    ...rules.inlineCode,
    order: rules.text.order - 0.25,
    match: inline(/^{{([^{}|]*)(?:\|\|([^|{}]+))?\}\}/),
    parse: parse.transcludeInline,
    jsonml: jsonml.transcludeInline
  },
  transcludeBlock: {
    ...rules.codeBlock,
    order: rules.text.order - 0.25,
    match: inline(/^{{([^{}|]*)(?:\|\|([^|{}]+))?\}\}(?:\r?\n|$)/),
    parse: parse.transcludeBlock,
    jsonml: jsonml.transcludeBlock
  },
  macroinline: {
    ...rules.inlineCode,
    match: inline(/^<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*?)>>/),
    parse: parse.macroInline,
    jsonml: jsonml.macroInline
  },
  macroblock: {
    order: rules.paragraph.order - 0.5,
    match: block(/^<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*?)>>(?:\r?\n|$)/),
    parse: parse.macroBlock,
    jsonml: jsonml.macroBlock
  },
  entity: {
    order: rules.text.order - 0.25,
    match: inline(/^(&#?[a-zA-Z0-9]{2,8};)/),
    parse: parse.entity,
    jsonml: jsonml.entity
  },
  widgetBlock: {
    ...rules.codeBlock,
    match: block(
      /^ *<\\?\$(\w+)>\s?((?:[^\n]*)\n{1,}(?:[\s\S]+?))\s*(?:<\\?\$\1>)/
    ),
    parse: parse.widgetBlock,
    jsonml: jsonml.widgetBlock
  }
  // jsonml: jsonml.widgetBlock
  // widgetInline: {
  //   ...rules.inlineCode,
  //   match: inline(/^<\$(\w+)>([\s\w]+)<\/\$\1>/),
  //   parse: parse.widgetInline,
  //   jsonml: jsonml.widgetInline
  // }
};

export default Object.assign(rules, newRules);
