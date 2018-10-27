const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = $tw => ({
  loadTiddlersFromFile(filepath, fields) {
    const ext = path.extname(filepath);
    const extensionInfo = $tw.utils.getFileExtensionInfo(ext);
    const type = extensionInfo ? extensionInfo.type : null;
    const typeInfo = type ? $tw.config.contentTypeInfo[type] : null;
    const data = fs.readFileSync(
      filepath,
      typeInfo ? typeInfo.encoding : 'utf8'
    );
    let tiddlers = $tw.wiki.deserializeTiddlers(ext, data, fields);
    let metadata;
    if (ext !== '.json' && tiddlers.length === 1) {
      metadata = $tw.loadMetadataForFile(filepath);
      tiddlers = [Object.assign({}, tiddlers[0], metadata)];
    }
    // add YAML metadata
    if (ext === '.md' && tiddlers.length === 1) {
      const { content: text, ...meta } = matter(data);
      tiddlers = [Object.assign({}, tiddlers[0], meta.data, { text })];
    }
    return { filepath, type, tiddlers, hasMetaFile: !!metadata };
  }
});
