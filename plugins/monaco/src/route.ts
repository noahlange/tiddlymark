(() => {
  exports.method = 'GET';
  // GET /workers/:author/:plugin/:file
  exports.path = /^\/workers\/((?:\w+\/?)+)\/((?:[\w]+)\.js)$/;
  exports.handler = async (
    _req: $AnyFixMe,
    res: $AnyFixMe,
    state: $AnyFixMe
  ): Promise<void> => {
    const file = state.params.join('/');
    const title = `$:/plugins/${file}`;
    const tiddler = state.wiki.getTiddler(title);

    if (tiddler) {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(tiddler.text);
    } else {
      res.statusCode = 404;
      res.end();
    }
  };
})();
