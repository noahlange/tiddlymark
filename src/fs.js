const fs = require('fs');
const path = require('path');
const { stringify } = require('gray-matter');

module.exports = $tw => ({
  /*
        Return a fileInfo object for a tiddler, creating it if necessary:
          filepath: the absolute path to the file containing the tiddler
          type: the type of the tiddler file (NOT the type of the tiddler -- see below)
          hasMetaFile: true if the file also has a companion .meta file

        The boot process populates $tw.boot.files for each of the tiddler files that it loads. The type is found by looking up the extension in $tw.config.fileExtensionInfo (eg "application/x-tiddler" for ".tid" files).

        It is the responsibility of the filesystem adaptor to update $tw.boot.files for new files that are created.
        */
  getTiddlerFileInfo(tiddler, callback) {
    // See if we've already got information about this file
    const title = tiddler.fields.title;
    let fileInfo = $tw.boot.files[title];
    if (fileInfo) {
      // If so, just invoke the callback
      callback(null, fileInfo);
    } else {
      // Otherwise, we'll need to generate it
      fileInfo = {};
      const tiddlerType = tiddler.fields.type || 'text/vnd.tiddlywiki';
      // Get the content type info
      const contentTypeInfo = $tw.config.contentTypeInfo[tiddlerType] || {};
      // Get the file type by looking up the extension
      let extension = contentTypeInfo.extension || '.tid';
      fileInfo.type = (
        $tw.config.fileExtensionInfo[extension] || {
          type: 'application/x-tiddler'
        }
      ).type;

      // determine if we're saving markdown so we can stuff YAML in the metadata.
      const notMarkdown = fileInfo.type !== 'text/x-markdown';

      // Use a .meta file unless we're saving a .tid file.
      // (We would need more complex logic if we supported other template rendered tiddlers besides .tid)
      fileInfo.hasMetaFile =
        fileInfo.type !== 'application/x-tiddler' &&
        fileInfo.type !== 'application/json' &&
        notMarkdown;

      if (!fileInfo.hasMetaFile && notMarkdown) {
        extension = '.tid';
      }
      // Generate the base filepath and ensure the directories exist
      const baseFilepath = path.resolve(
        $tw.boot.wikiTiddlersPath,
        this.generateTiddlerBaseFilepath(title)
      );
      $tw.utils.createFileDirectories(baseFilepath);
      // Start by getting a list of the existing files in the directory
      fs.readdir(path.dirname(baseFilepath), (err, files) => {
        if (err) {
          return callback(err);
        }
        // Start with the base filename plus the extension
        let filepath = baseFilepath;
        if (
          filepath.substr(-extension.length).toLocaleLowerCase() !==
          extension.toLocaleLowerCase()
        ) {
          filepath = filepath + extension;
        }
        let filename = path.basename(filepath);
        let count = 1;
        // Add a discriminator if we're clashing with an existing filename while
        // handling case-insensitive filesystems (NTFS, FAT/FAT32, etc.)
        while (
          files.some(
            value => value.toLocaleLowerCase() === filename.toLocaleLowerCase()
          )
        ) {
          filepath = baseFilepath + ' ' + count++ + extension;
          filename = path.basename(filepath);
        }
        // Set the final fileInfo
        fileInfo.filepath = filepath;
        console.log(
          '\x1b[1;35m' +
            'For ' +
            title +
            ', type is ' +
            fileInfo.type +
            ' hasMetaFile is ' +
            fileInfo.hasMetaFile +
            ' filepath is ' +
            fileInfo.filepath +
            '\x1b[0m'
        );
        $tw.boot.files[title] = fileInfo;
        // Pass it to the callback
        callback(null, fileInfo);
      });
    }
  },

  /*
    Save a tiddler and invoke the callback with (err,adaptorInfo,revision)
    */
  saveTiddler(tiddler, callback) {
    this.getTiddlerFileInfo(tiddler, (err, fileInfo) => {
      if (err) {
        return callback(err);
      }
      let content;
      let filepath = fileInfo.filepath;
      let error = $tw.utils.createDirectory(path.dirname(filepath));
      if (error) {
        return callback(error);
      }
      if (fileInfo.hasMetaFile) {
        // Save the tiddler as a separate body and meta file
        const typeInfo = $tw.config.contentTypeInfo[
          tiddler.fields.type || 'text/plain'
        ] || { encoding: 'utf8' };
        fs.writeFile(
          filepath,
          tiddler.fields.text,
          { encoding: typeInfo.encoding },
          err => {
            if (err) {
              return callback(err);
            }
            content = this.wiki.renderTiddler(
              'text/plain',
              '$:/core/templates/tiddler-metadata',
              { variables: { currentTiddler: tiddler.fields.title } }
            );
            fs.writeFile(
              fileInfo.filepath + '.meta',
              content,
              { encoding: 'utf8' },
              err => {
                if (err) {
                  return callback(err);
                }
                this.logger.log('Saved file', filepath);
                return callback(null);
              }
            );
          }
        );
      } else {
        const isMarkdown = fileInfo.type === 'text/x-markdown';

        // Save the tiddler as a self contained templated file
        content = this.wiki.renderTiddler(
          'text/plain',
          '$:/core/templates/tid-tiddler',
          { variables: { currentTiddler: tiddler.fields.title } }
        );

        // if it's markdown, write the metadata inline.
        if (isMarkdown) {
          const fields = Object.assign({}, tiddler.fields, {
            created: $tw.utils.stringifyDate(tiddler.fields.created),
            modified: $tw.utils.stringifyDate(tiddler.fields.modified)
          });
          delete fields.text;
          content = stringify(tiddler.fields.text, fields);
        }

        fs.writeFile(filepath, content, { encoding: 'utf8' }, err => {
          if (err) {
            return callback(err);
          }
          this.logger.log('Saved file', filepath);
          return callback(null);
        });
      }
    });
  }
});
