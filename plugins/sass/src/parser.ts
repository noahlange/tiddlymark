import * as p from '$:/core/modules/parsers/textparser.js';

export const name = 'scss';

export default {
  ['text/scss']: p['text/scss'] ??= p['text/css']
};
