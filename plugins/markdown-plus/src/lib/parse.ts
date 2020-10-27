import type { SingleASTNode, State, Capture } from 'simple-markdown';

export function block(
  capture: Capture,
  nestedParse: Parser,
  state: State
): SingleASTNode {
  if (!state.blocks) {
    state.blocks = 1;
  }
  return {
    type: 'block',
    block: capture[1],
    // hacky hack hack; we need to parse the contents for block-level
    // items, so we'll wrap it in newlines until the parser's happy
    content: nestedParse(`\n\n${capture[2]}\n\n`, { inline: false }),
    id: state.blocks++
  };
}

export function emoji(capture: Capture): SingleASTNode {
  return { type: 'emoji', content: capture[1] };
}

export function transcludeInline(capture: Capture): SingleASTNode {
  const [, textRef = '', template = ''] = capture;
  return {
    type: 'transcludeInline',
    template: template.trim(),
    reference: textRef.trim()
  };
}

export function transcludeBlock(capture: Capture): SingleASTNode {
  const [, textRef = '', template = ''] = capture;
  return {
    type: 'transcludeBlock',
    template: template.trim(),
    reference: textRef.trim()
  };
}

export function widgetBlock(capture: Capture): SingleASTNode {
  const [, widget, content] = capture;
  return { type: 'widgetBlock', widget, content };
}

export function macroInline(capture: Capture): SingleASTNode {
  const [, name, allParams] = capture;
  const params = [];
  const re = /\s*(?:([A-Za-z0-9\-_]+)\s*:)?(?:\s*(?:"""([\s\S]*?)"""|"([^"]*)"|'([^']*)'|\[\[([^\]]*)\]\]|([^"'\s]+)))/gm;
  let match = re.exec(allParams);
  while (match) {
    const info = {
      value: match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6],
      name: match[1] ?? null
    };
    params.push(info);
    match = re.exec(allParams);
  }
  return { type: 'macroinline', name, params };
}

export function macroBlock(capture: Capture): SingleASTNode {
  const [, name, allParams] = capture;
  const params = [];
  const re = /\s*(?:([A-Za-z0-9\-_]+)\s*:)?(?:\s*(?:"""([\s\S]*?)"""|"([^"]*)"|'([^']*)'|\[\[([^\]]*)\]\]|([^"'\s]+)))/gm;
  let match = re.exec(allParams);
  while (match) {
    const info = {
      value: match[2] || match[3] || match[4] || match[5] || match[6],
      name: match[1] ?? null
    };
    params.push(info);
    match = re.exec(allParams);
  }
  return { type: 'macroblock', name, params };
}

export function entity([entity]: Capture): SingleASTNode {
  return { type: 'entity', entity };
}
