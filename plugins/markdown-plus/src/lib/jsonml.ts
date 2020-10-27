import emojiDict from '../emoji';

import type { SingleASTNode, Output, State } from 'simple-markdown';
import { sanitizeUrl } from 'simple-markdown';
import type { JSONMLNode } from '../utils';
import { links, makeTransclusionNode } from '../utils';
import param from '../param';

export function array(
  node: SingleASTNode[],
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  let result: JSONMLNode = [];
  // map output over the ast, except group any text
  // nodes together into a single string output.
  for (let i = 0; i < node.length; i++) {
    let curr = node[i];
    if (curr.type === 'text') {
      curr = { type: 'text', content: curr.content };
      for (; i + 1 < curr.length && curr[i + 1].type === 'text'; i++) {
        curr.content += curr[i + 1].content;
      }
    }
    result = result.concat(output(curr, state));
  }
  return result;
}

export function heading(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  const [str] = output(node.content, state) as string[];
  const id = typeof str === 'string' ? param(str).toLowerCase() : null;
  return id ? ['h' + node.level, { id }, str] : ['h' + node.level, str];
}

export function codeBlock(node: SingleASTNode): JSONMLNode {
  const cn = node.lang ? 'hljs ' + node.lang : '';
  return [
    'pre',
    { class: cn, 'data-lang': node.lang },
    ['code', node.content]
  ] as JSONMLNode;
}

export function blockquote(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  return ['blockquote', ...output(node.content, state)];
}

export function block(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  return [
    'div',
    { class: `block ${node.block}` },
    ...output(node.content, state)
  ];
}

export function list(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  const tag = node.ordered ? 'ol' : 'ul';
  return [
    tag,
    ...node.items.map((i: SingleASTNode) => ['li', ...output(i, state)])
  ];
}

export function table(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  const style = (i: number): string =>
    node.align[i] ? `text-align: ${node.align[i]};` : '';

  const thead: JSONMLNode = [
    'thead',
    ...node.header.map(
      (content: SingleASTNode[], i: number): JSONMLNode => [
        'th',
        { style: style(i) },
        ...output(content, state)
      ]
    )
  ];

  const tbody: JSONMLNode = [
    'tbody',
    ...node.cells.map((row: SingleASTNode[]) => {
      const cols = row.map((content: SingleASTNode, i) => {
        return ['td', { style: style(i) }, ...output(content, state)];
      });
      return ['tr', ...cols];
    })
  ];

  return ['table', thead, tbody] as JSONMLNode;
}

export function link(
  node: SingleASTNode,
  output: Output<JSONMLNode>,
  state: State
): JSONMLNode {
  const target = sanitizeUrl(node.target) || '';
  const prefixed = links.prefixed.test(target);
  const external = links.external.test(target);
  const attributes = {
    href: prefixed ? target : `#${target}`,
    title: target.split('/').pop(),
    target: external ? '_blank' : '',
    class: external ? 'tc-tiddlylink-external' : '',
    rel: external ? 'noopener noreferrer' : ''
  };
  return ['a', attributes, ...output(node.content, state)];
}

export function image(node: SingleASTNode): JSONMLNode {
  return [
    'img',
    {
      src: sanitizeUrl(node.target) || '#',
      alt: node.alt,
      title: node.title
    }
  ];
}

export function tag(tag: string): () => JSONMLNode {
  return (): JSONMLNode => [tag];
}

export function element(tag: string) {
  return (
    node: SingleASTNode,
    output: Output<JSONMLNode>,
    state: State
  ): JSONMLNode => [tag, ...output(node.content, state)];
}

export function text(node: SingleASTNode): JSONMLNode {
  return node.content;
}

export function emoji(node: SingleASTNode): JSONMLNode {
  return emojiDict[node.content] || '';
}

export function transcludeInline(node: SingleASTNode): JSONMLNode {
  return [
    'transclude',
    makeTransclusionNode(node.reference, node.template, false)
  ];
}

export function transcludeBlock(node: SingleASTNode): JSONMLNode {
  return [
    'transclude',
    makeTransclusionNode(node.reference, node.template, true)
  ];
}

export function macroInline(node: SingleASTNode): JSONMLNode {
  return ['macroinline', node];
}

export function macroBlock(node: SingleASTNode): JSONMLNode {
  return ['macroblock', node];
}

export function entity(node: SingleASTNode): JSONMLNode {
  return ['entity', node];
}

export function widgetBlock(node: SingleASTNode): JSONMLNode {
  return [
    'widget',
    {
      type: node.widget,
      attributes: {
        content: { type: 'string', value: node.content }
      }
    }
  ];
}

export function inlineCode(node: SingleASTNode): JSONMLNode {
  return ['code', node.content];
}
