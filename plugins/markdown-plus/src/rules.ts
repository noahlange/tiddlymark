import emoji from './emoji';

import {
  defaultRules as rules,
  sanitizeUrl,
  blockRegex,
  ParserRules,
  SingleASTNode
} from 'simple-markdown';
import param from './param';

type HeadingNode = SingleASTNode<{ level: number; content: string }>;

const inline = (regex: RegExp) => {
  const match = (source: string, state) => {
    return state.inline ? regex.exec(source) : null;
  };
  match.regex = regex;
  return match;
};

const block = (regex: RegExp) => {
  const match = (source: string, state) => {
    return state.inline ? null : regex.exec(source);
  };
  match.regex = regex;
  return match;
};

const newRules: ParserRules = {
  Array: {
    ...rules.Array,
    jsonml(arr, output, state) {
      const result = [];
      // map output over the ast, except group any text
      // nodes together into a single string output.
      for (let i = 0; i < arr.length; i++) {
        let node = arr[i];
        if (node.type === 'text') {
          node = { type: 'text', content: node.content };
          for (; i + 1 < arr.length && arr[i + 1].type === 'text'; i++) {
            node.content += arr[i + 1].content;
          }
        }

        result.push(output(node, state));
      }
      return result;
    }
  },
  heading: {
    ...rules.heading,
    match: block(/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n *)/),
    jsonml(node: HeadingNode, output, state) {
      const [str] = output(node.content, state);
      const id = param(str).toLowerCase();
      return ['h' + node.level, { id }, str];
    }
  },
  br: {
    ...rules.br,
    jsonml: () => ['br']
  },
  hr: {
    ...rules.hr,
    jsonml: () => ['hr']
  },
  codeBlock: {
    ...rules.codeBlock,
    jsonml(node, output, state) {
      const cn = node.lang ? 'hljs ' + node.lang : '';
      const cb = ['code', node.content];
      return ['pre', { class: cn, 'data-lang': node.lang }, cb];
    }
  },
  blockQuote: {
    ...rules.blockQuote,
    jsonml: (node, output, state) => [
      'blockquote',
      ...output(node.content, state)
    ]
  },
  block: {
    match: blockRegex(/^ *(?::{3})\s?([^\n]*)\n{1,}([\s\S]+?)\s*(?::{3})/),
    // match: blockRegex(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n *)+\n/),
    // match: blockRegex(/^ *(:{3,}) *(\S+)? *\n([\s\S]+?)\s*(?:\1)/),
    order: rules.fence.order--,
    parse(capture, recurseParse, state) {
      if (!state.blocks) {
        state.blocks = 1;
      }
      return {
        block: capture[1],
        // hacky hack hack; we need to parse the contents for block-level
        // items, so we'll wrap it in newlines until the parser's happy
        content: recurseParse(
          `\n\n${capture[2]}\n\n`,
          { inline: false },
          state
        ),
        id: state.blocks++
      };
    },
    jsonml: (node, output, state) => {
      return [
        'div',
        { class: `block ${node.block}` },
        ...output(node.content, state)
      ];
    }
  },
  list: {
    ...rules.list,
    jsonml: (node, output, state) => {
      const items = node.items.map(i => ['li', ...output(i, state)]);
      const tag = node.ordered ? 'ol' : 'ul';
      return [tag, ...items];
    }
  },
  table: {
    ...rules.table,
    jsonml: (node, output, state) => {
      const style = i => (node.align[i] ? `text-align: ${node.align[i]};` : '');
      const head = node.header.map((content, i) => [
        'th',
        { style: style(i) },
        ...output(content, state)
      ]);
      const body = node.cells.map(row => {
        const cols = row.map((content, i) => {
          return ['td', { style: style(i) }, ...output(content, state)];
        });
        return ['tr', ...cols];
      });
      return ['table', ['thead', ...head], ['tbody', ...body]];
    }
  },
  link: {
    ...rules.link,
    match: inline(
      /^\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?(.*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/
    ),
    jsonml: (node, output, state) => {
      const target = sanitizeUrl(node.target);
      const attributes = {
        href: /^(#|\/|http|https)/.test(target) ? target : `#${target}`,
        title: node.title
      };
      return ['a', attributes, ...output(node.content, state)];
    }
  },
  image: {
    ...rules.image,
    match: inline(
      /^!\[((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*)\]\(\s*<?(.*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*\)/
    ),
    jsonml: (node, output, state) => {
      const attributes = {
        src: sanitizeUrl(node.target),
        alt: node.alt,
        title: node.title
      };
      return ['img', attributes];
    }
  },
  em: {
    ...rules.em,
    jsonml: (node, output, state) => ['em', ...output(node.content, state)]
  },
  strong: {
    ...rules.strong,
    jsonml: (node, output, state) => ['strong', ...output(node.content, state)]
  },
  u: {
    ...rules.u,
    jsonml: (node, output, state) => ['u', ...output(node.content, state)]
  },
  del: {
    ...rules.del,
    jsonml: (node, output, state) => ['del', ...output(node.content, state)]
  },
  sub: {
    ...rules.del,
    order: rules.del.order + 0.25,
    match: inline(/^\~(\w+)\~/),
    jsonml: (node, output, state) => ['sub', ...output(node.content, state)]
  },
  sup: {
    ...rules.del,
    order: rules.del.order + 0.5,
    match: inline(/^\^(\w+)\^/),
    jsonml: (node, output, state) => ['sup', ...output(node.content, state)]
  },
  inlineCode: {
    ...rules.inlineCode,
    jsonml: node => ['code', node.content]
  },
  newline: {
    ...rules.newline,
    jsonml: () => '\n'
  },
  text: {
    ...rules.text,
    jsonml: node => node.content
  },
  emoji: {
    ...rules.text,
    order: rules.text.order - 0.25,
    match: inline(/^:(\w+):/),
    parse(capture, parse, state) {
      return { type: 'emoji', content: capture[1] };
    },
    jsonml(node, output, state) {
      return emoji[node.content] || '';
    }
  },
  paragraph: {
    ...rules.paragraph,
    jsonml: (node, output, state) => ['p', ...output(node.content, state)]
  },
  macroinline: {
    ...rules.inlineCode,
    match: inline(/^<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*?)>>/),
    parse: (capture: string[]) => {
      const [, name, allParams] = capture;
      const params = [];
      const re = /\s*(?:([A-Za-z0-9\-_]+)\s*:)?(?:\s*(?:"""([\s\S]*?)"""|"([^"]*)"|'([^']*)'|\[\[([^\]]*)\]\]|([^"'\s]+)))/gm;
      let match = re.exec(allParams);
      while (match) {
        const info = {
          value: match[2] || match[3] || match[4] || match[5] || match[6],
          name: match[1] || 'icon'
        };
        params.push(info);
        match = re.exec(allParams);
      }
      return { type: 'macroinline', name, params };
    },
    jsonml: node => ['macroinline', node]
  },
  macroblock: {
    order: rules.paragraph.order - 0.5,
    match: block(/^<<([^>\s]+)(?:\s*)((?:[^>]|(?:>(?!>)))*?)>>(?:\r?\n|$)/),
    parse: (capture: string[]) => {
      const [, name, allParams] = capture;
      const params = [];
      const re = /\s*(?:([A-Za-z0-9\-_]+)\s*:)?(?:\s*(?:"""([\s\S]*?)"""|"([^"]*)"|'([^']*)'|\[\[([^\]]*)\]\]|([^"'\s]+)))/gm;
      let match = re.exec(allParams);
      while (match) {
        const info = {
          value: match[2] || match[3] || match[4] || match[5] || match[6],
          name: match[1]
        };
        params.push(info);
        match = re.exec(allParams);
      }
      return { type: 'macroblock', name, params };
    },
    jsonml: node => ['macroblock', node]
  },
  entity: {
    order: rules.text.order - 0.25,
    match: inline(/^(&#?[a-zA-Z0-9]{2,8};)/),
    parse: ([entity]: string[]) => {
      return { type: 'entity', entity };
    },
    jsonml: node => ['entity', node]
  }
};

export default Object.assign(rules, newRules);
