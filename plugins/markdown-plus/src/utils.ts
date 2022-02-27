import type { RefiningNodeOutput, ArrayNodeOutput } from 'simple-markdown';

export interface JSONMLAttributeNode {
  [key: string]: string | number;
}
export type JSONMLChildNode = string | JSONMLAttributeNode | WidgetNode;
export type JSONMLNode = JSONMLChildNode | JSONMLChildNode[];

export interface JSONMLOutputRule {
  jsonml: RefiningNodeOutput<JSONMLNode, JSONMLNode>;
}
export interface JSONMLArrayRule {
  jsonml: ArrayNodeOutput<JSONMLNode>;
}

function makeTextRefWithTemplate(
  title: string,
  template: string,
  isBlock: boolean
): WidgetNode {
  return {
    type: 'tiddler',
    attributes: { type: 'string', value: title },
    children: [
      {
        type: 'transclude',
        isBlock: isBlock,
        attributes: {
          tiddler: { type: 'string', value: template }
        }
      }
    ]
  };
}

function makeTextRefWithoutTemplate(
  title: string,
  isBlock: boolean,
  field?: string,
  index?: string
): WidgetNode {
  const attributes: Record<string, { type: string; value?: string }> = {
    tiddler: { type: 'string', value: title },
    field: { type: 'string', value: field },
    index: { type: 'string', value: index }
  };

  if (!field) {
    delete attributes.field;
  }
  if (!index) {
    delete attributes.index;
  }

  return {
    type: 'tiddler',
    attributes: {
      tiddler: { type: 'string', value: title }
    },
    isBlock,
    children: [
      {
        type: 'transclude',
        isBlock,
        attributes
      }
    ]
  };
}

export function makeTransclusionNode(
  ref: string,
  tpl: string,
  isBlock: boolean
): WidgetNode {
  if (ref) {
    const { title, field, index } = $tw.utils.parseTextReference(ref);
    return tpl
      ? makeTextRefWithTemplate(title, tpl, isBlock)
      : makeTextRefWithoutTemplate(title, isBlock, field, index);
  } else {
    return tpl
      ? {
          type: 'transclude',
          isBlock,
          attributes: { tiddler: { type: 'string', value: tpl } }
        }
      : { type: 'transclude', isBlock, attributes: {} };
  }
}

export const links = {
  prefixed: /^(#|\/|http|https)/,
  external: /^(file|http|https|mailto|ftp|irc|news|data|skype)/
};
