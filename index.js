const { TiddlyWiki } = require('tiddlywiki/boot/boot.js');
const boot = require('./src/boot');
const sync = require('./src/fs');

const $tw = TiddlyWiki();
const { loadTiddlersFromFile } = boot($tw);
const { getTiddlerFileInfo, saveTiddler } = sync($tw);

$tw.boot.argv = process.argv.slice(2);
// overwrite parsing so we can parse frontmatter
$tw.loadTiddlersFromFile = loadTiddlersFromFile.bind($tw);
$tw.boot.boot();

// create a new file system adapter
const syncadaptor = $tw.syncer.syncadaptor;
// update reads so we can return yaml frontmatter
syncadaptor.getTiddlerFileInfo = getTiddlerFileInfo.bind(syncadaptor);
// update writes so we can write yaml frontmatter
syncadaptor.saveTiddler = saveTiddler.bind(syncadaptor);
