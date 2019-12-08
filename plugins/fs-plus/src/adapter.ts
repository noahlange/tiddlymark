type FSPlusAdaptorOptions = {
  wiki: Wiki;
};

((): void => {
  // only run under Node
  if ($tw.browser) {
    return;
  }

  const fs = import('fs');
  const path = import('path');
  const matter = import('gray-matter');

  class Adaptor {
    public name = 'fs-plus';
    public wiki: Wiki;
    public logger = new $tw.utils.Logger('fs-plus', { colour: 'blue' });

    /*
    Save a tiddler to a file described by the fileInfo:
      filepath: the absolute path to the file containing the tiddler
      type: the type of the tiddler file (NOT the type of the tiddler)
      hasMetaFile: true if the file also has a companion .meta file
    */
    public async saveTiddlerToFile(
      tiddler: Tiddler,
      fileInfo: FileInfo,
      callback?: Callback
    ): Promise<void> {
      const { dirname } = await path;
      const { promises } = await fs;
      const { stringify } = await matter;

      $tw.utils.createDirectory(dirname(fileInfo.filepath));

      try {
        if (fileInfo.hasMetaFile) {
          // Save the tiddler as a separate body and meta file
          const typeInfo = $tw.config.contentTypeInfo[
            tiddler.fields.type || 'text/plain'
          ] || { encoding: 'utf8' };
          await promises.writeFile(
            fileInfo.filepath,
            tiddler.fields.text,
            typeInfo.encoding
          );
          await promises.writeFile(
            fileInfo.filepath + '.meta',
            tiddler.getFieldStringBlock({ exclude: ['text', 'bag'] }),
            'utf8'
          );
        } else {
          switch (fileInfo.type) {
            case 'application/x-tiddler': {
              await promises.writeFile(
                fileInfo.filepath,
                tiddler.getFieldStringBlock({
                  exclude: ['text', 'bag']
                }) + (tiddler.fields.text ? '\n\n' + tiddler.fields.text : ''),
                'utf8'
              );
              break;
            }
            case 'text/x-markdown': {
              const { text, ...fields } = tiddler.getFieldStrings();
              delete fields.bag;
              await promises.writeFile(
                fileInfo.filepath,
                stringify(text || '', {
                  ...fields,
                  created: fields.created,
                  modified: fields.modified
                }),
                'utf8'
              );
              break;
            }
            default: {
              const meta = JSON.stringify(
                [tiddler.getFieldStrings({ exclude: ['bag'] })],
                null,
                $tw.config.preferences.jsonSpaces
              );
              await promises.writeFile(fileInfo.filepath, meta, 'utf8');
              break;
            }
          }
        }
        if (callback) {
          callback(null);
        }
      } catch (e) {
        this.logger.log(`saveTiddlerToFile: ${e.message}`);
        if (callback) {
          callback(e);
        }
      }
    }

    /*
      Create a fileInfo object for saving a tiddler:
        filepath: the absolute path to the file containing the tiddler
        type: the type of the tiddler file (NOT the type of the tiddler)
        hasMetaFile: true if the file also has a companion .meta file
      Options include:
        directory: absolute path of root directory to which we are saving
        pathFilters: optional array of filters to be used to generate the base path
        wiki: optional wiki for evaluating the pathFilters
    */
    public generateTiddlerFileInfo(
      tiddler: Tiddler,
      options: GenerateFilepathOptions
    ): FileInfo {
      // Check if the tiddler has any unsafe fields that can't be expressed in a .tid or .meta file: containing control characters, or leading/trailing whitespace
      const hasUnsafeFields = Object.entries(tiddler.getFieldStrings()).some(
        ([k, value]) => {
          return (
            k !== 'text' &&
            (/[\x00-\x1F]/gm.test(value) || $tw.utils.trim(value) !== value)
          );
        }
      );

      const { type, title } = tiddler.fields;

      const info = hasUnsafeFields
        ? { type: 'application/json', hasMetaFile: false }
        : type && type !== 'text/vnd.tiddlywiki'
        ? { type, hasMetaFile: true }
        : { type: 'application/x-tiddler', hasMetaFile: false };

      const contentType = $tw.config.contentTypeInfo[info.type];
      const extension =
        contentType && !title.endsWith(contentType.extension)
          ? contentType.extension
          : undefined;

      return {
        ...info,
        filepath: $tw.utils.generateTiddlerFilepath(title, {
          ...options,
          extension
        })
      };
    }

    /*
      Load a tiddler and invoke the callback with (err,tiddlerFields)
      We don't need to implement loading for the file system adaptor, because
      all tiddlers have been loaded during the boot process.
    */
    public async loadTiddler(title: string, callback: Callback): Promise<null> {
      if (callback) {
        callback(null, null);
      }
      return null;
    }

    /*
      Save a tiddler and invoke the callback with (err, adaptorInfo, revision)
    */
    public async saveTiddler(
      tiddler: Tiddler,
      callback?: Callback
    ): Promise<void> {
      this.logger.log(`saving tiddler: ${tiddler.fields.title}`);
      try {
        const info = this.getTiddlerFileInfo(tiddler);
        await this.saveTiddlerToFile(tiddler, info);
        if (callback) {
          callback(null, null);
        }
      } catch (e) {
        this.logger.log(`Error: ${e.message}`);
        if (callback) {
          callback(e);
        }
      }
    }

    public async deleteEmptyDirs(
      directory: string,
      callback?: Callback
    ): Promise<void> {
      const { dirname } = await path;
      const { promises } = await fs;
      try {
        const files = await promises.readdir(directory);
        if (files.length) {
          if (callback) {
            callback(null);
          }
        } else {
          await promises.rmdir(directory);
          await this.deleteEmptyDirs(dirname(directory));
          if (callback) {
            callback(null);
          }
        }
      } catch (e) {
        if (callback) {
          return callback(e);
        } else {
          this.logger.log(`Error: ${e.message}`);
        }
      }
    }

    /*
     * Delete a tiddler and invoke the callback with (err)
     */
    public async deleteTiddler(
      title: string,
      callback?: Callback
    ): Promise<void> {
      try {
        const { promises } = await fs;
        const { dirname } = await path;
        const info = $tw.boot.files[title];
        // Only delete the tiddler if we have writable information for the file
        if (info) {
          // Delete the file
          await promises.unlink(info.filepath);
          // Delete the metafile if present
          if (info.hasMetaFile) {
            await promises.unlink(info.filepath + '.meta');
          }
          await this.deleteEmptyDirs(dirname(info.filepath), callback);
        }
        if (callback) {
          callback(null);
        }
      } catch (e) {
        this.logger.log(`Error: ${e.message}`);
        if (callback) {
          callback(e);
        }
      }
    }

    /*
      Return a fileInfo object for a tiddler, creating it if necessary:
        filepath: the absolute path to the file containing the tiddler
        type: the type of the tiddler file (NOT the type of the tiddler -- see below)
        hasMetaFile: true if the file also has a companion .meta file
      The boot process populates $tw.boot.files for each of the tiddler files that it loads. The type is found by looking up the extension in $tw.config.fileExtensionInfo (eg "application/x-tiddler" for ".tid" files).
      It is the responsibility of the filesystem adaptor to update $tw.boot.files for new files that are created.
    */
    public getTiddlerFileInfo(tiddler: Tiddler): FileInfo;
    public getTiddlerFileInfo(
      tiddler: Tiddler,
      callback: Callback<FileInfo>
    ): void;
    public getTiddlerFileInfo(
      tiddler: Tiddler,
      callback?: Callback<FileInfo>
    ): FileInfo | void {
      try {
        const wiki = this.wiki;
        // See if we've already got information about this file
        const title = tiddler.fields.title;
        let info = $tw.boot.files[title];

        if (!info) {
          const filters =
            wiki.getTiddlerText('$:/config/FileSystemPaths') || '';

          // Otherwise, we'll need to generate it
          const tmp = this.generateTiddlerFileInfo(tiddler, {
            directory: $tw.boot.wikiTiddlersPath,
            pathFilters: filters.split('\n'),
            wiki
          });

          const notMarkdown = tmp.type !== 'text/x-markdown';
          const hasMetaFile =
            tmp.type !== 'application/x-tiddler' &&
            tmp.type !== 'application/json' &&
            notMarkdown;

          info = $tw.boot.files[title] = {
            ...tmp,
            hasMetaFile,
            extension: !hasMetaFile && notMarkdown ? '.tid' : tmp.extension
          };
        }

        if (callback) {
          callback(null, info);
        } else {
          return info;
        }
      } catch (e) {
        this.logger.log(`Error: ${e.message}`);
        if (callback) {
          callback(e);
        }
      }
    }

    getTiddlerInfo(): object {
      return {};
    }

    isReady(): boolean {
      return true;
    }

    constructor(options: FSPlusAdaptorOptions) {
      this.wiki = options.wiki;
      // Create the <wiki>/tiddlers folder if it doesn't exist
      $tw.utils.createDirectory($tw.boot.wikiTiddlersPath);
    }
  }

  exports.adaptorClass = Adaptor;
})();
