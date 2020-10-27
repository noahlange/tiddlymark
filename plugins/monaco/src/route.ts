export const method = 'GET';
// GET /workers/:author/:plugin/:file
export const path = /^\/workers\/((?:\w+\/?)+)\/((?:[\w]+)(?:\.worker)?\.js)$/;

export async function handler(
  _req: $AnyFixMe,
  res: $AnyFixMe,
  state: $AnyFixMe
): Promise<void> {
  const file = state.params.join('/');
  const title = `$:/plugins/${file}`;
  const tiddler = (state.wiki as Wiki).getTiddler(title);

  if (tiddler) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(tiddler.getFieldString('text'));
  } else {
    res.statusCode = 404;
    res.end();
  }
}
