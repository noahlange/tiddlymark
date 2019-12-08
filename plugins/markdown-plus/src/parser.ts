// @ts-nocheck

import { parserFor, reactFor, ruleOutput } from 'simple-markdown';
import rules from './rules';

function transformNode(node) {
  if ($tw.utils.isArray(node)) {
    let p = 0;
    const widget = { type: 'element', tag: node[p++] };
    if (!$tw.utils.isArray(node[p]) && typeof node[p] === 'object') {
      const o = node[p++] || {};
      widget.attributes = Object.keys(o).reduce(
        (a, name) => ({
          ...a,
          [name]: { type: 'string', value: o[name] }
        }),
        {}
      );
    }
    // filter out null (i.e., blank text) nodes
    widget.children = transformNodes(node.slice(p++));

    switch (widget.tag) {
      // massage images into the image widget
      case 'img':
        widget.type = 'image';
        if (widget.attributes.alt) {
          widget.attributes.tooltip = widget.attributes.alt;
          delete widget.attributes.alt;
        }
        if (widget.attributes.src) {
          widget.attributes.source = widget.attributes.src;
          delete widget.attributes.src;
        }
        break;
      case 'a':
        if (widget.attributes.href.value[0] === '#') {
          widget.type = 'link';
          widget.attributes.to = widget.attributes.href;
          if (widget.attributes.to.type === 'string') {
            //Remove '#' before conversion to wikilink
            widget.attributes.to.value = widget.attributes.to.value.substr(1);
          }
          //Children is fine
          delete widget.tag;
          delete widget.attributes.href;
        }
        break;
      case 'pre':
        widget.type = 'codeblock';
        widget.attributes = {
          code: {
            type: 'string',
            value: widget.children[0].children[0].text
          },
          language: widget.attributes['data-lang']
        };
        delete widget.children;
        delete widget.tag;
        break;
      case 'macroblock':
      case 'macroinline': {
        const isBlock = widget.tag !== 'macroinline';
        // wrap in a relevant tag, otherwise TW will render a `p` tag
        widget.tag = isBlock ? 'div' : 'span';
        widget.children = [
          {
            type: 'macrocall',
            isBlock,
            name: widget.attributes.name.value,
            params: widget.attributes.params.value
          }
        ];
        break;
      }
      case 'entity':
        widget.type = 'entity';
        widget.entity = widget.attributes.entity.value;
        delete widget.children;
        delete widget.tag;
        break;
    }
    return widget;
  } else if (node.replace(/\s+/gim, '') !== '') {
    return { type: 'text', text: node };
  }
  return null;
}

function transformNodes(nodes) {
  const results = [];
  for (const node of nodes) {
    results.push(transformNode(node));
  }
  return results.filter(n => !!n);
}

((): void => {
  const parser = parserFor(rules);
  const render = reactFor(ruleOutput(rules, 'jsonml'));
  exports['text/x-markdown'] = function(text: string) {
    const tree = parser(text, { inline: false });
    const output = render(tree);
    this.tree = transformNodes(output);
  };
})();
