import * as fs from 'fs/promises';
import { dirname } from 'path';
import matter from 'gray-matter';
import mkdirp from 'mkdirp';

interface FSPlusAdaptorOptions {
  wiki: Wiki;
  boot: typeof $tw.boot;
}

class Adaptor {
  public name = 'fs-plus';
  public supportsLazyLoading = false;
  public wiki: Wiki;
  public boot: typeof $tw.boot;
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
  ): Promise<FileInfo> {
    const { stringify } = matter;

    const title = tiddler.fields.title as string;
    const text = tiddler.fields.text as string;
    const type = tiddler.fields.type as string;

    try {
      const dir = dirname(fileInfo.filepath);

      await mkdirp(dir);

      if (fileInfo.hasMetaFile) {
        // Save the tiddler as a separate body and meta file
        const typeInfo = $tw.config.contentTypeInfo[type ?? 'text/plain'] ?? {
          encoding: 'utf8'
        };

        await fs.writeFile(
          fileInfo.filepath,
          text?.toString() ?? '',
          typeInfo.encoding as BufferEncoding
        );

        await fs.writeFile(
          fileInfo.filepath + '.meta',
          tiddler.getFieldStringBlock({ exclude: ['text', 'bag'] }),
          'utf8'
        );
      } else {
        switch (fileInfo.type) {
          case 'application/x-tiddler': {
            await fs.writeFile(
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
            await fs
              .writeFile(
                fileInfo.filepath,
                stringify(text || '' + '\n', {
                  ...fields,
                  created: fields.created,
                  modified: fields.modified
                }),
                'utf8'
              )
              .catch(e => {
                console.error(e);
                console.log(fileInfo);
              });
            break;
          }
          default: {
            const meta = JSON.stringify(
              tiddler.getFieldStrings({ exclude: ['bag'] }),
              null,
              $tw.config.preferences.jsonSpaces
            );
            await fs.writeFile(fileInfo.filepath, meta, 'utf8');
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (callback) {
        callback(e);
      }
    }

    return $tw.boot.files[title];
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
          /* eslint-disable-next-line no-control-regex */
          (/[\x00-\x1F]/gm.test(value) || $tw.utils.trim(value) !== value)
        );
      }
    );

    const title = tiddler.fields.title as string;
    const type = tiddler.fields.type as string;

    const info = hasUnsafeFields
      ? { type: 'application/json', hasMetaFile: false }
      : type && type !== 'text/vnd.tiddlywiki'
      ? { type, hasMetaFile: true }
      : { type: 'application/x-tiddler', hasMetaFile: false };

    const contentType = $tw.config.contentTypeInfo[info.type];

    let extension =
      contentType && !title.endsWith(contentType.extension)
        ? contentType.extension
        : undefined;

    if (options.extFilters?.length) {
      // Check for extension override
      const tmp = $tw.utils.generateTiddlerExtension(tiddler.fields.title, {
        extFilters: options.extFilters,
        wiki: options.wiki
      });

      if (extension) {
        extension = tmp;
        switch (extension) {
          case '.tid': {
            info.type = 'application/x-tiddler';
            info.hasMetaFile = false;
            break;
          }
          case '.json': {
            info.type = 'application/json';
            info.hasMetaFile = false;
            break;
          }
          default: {
            //If the new type matches a known extention, use that MIME type's encoding
            const extInfo = $tw.utils.getFileExtensionInfo(extension);
            extInfo.type = extInfo ? extInfo.type : null;
            extInfo.encoding = $tw.utils.getTypeEncoding(extension);
            extInfo.hasMetaFile = true;
          }
        }
      }
    }

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
    callback?: Callback<FileInfo>
  ): Promise<FileInfo> {
    const title = tiddler.fields.title as string;
    this.logger.log(`saving tiddler: ${title}`);

    try {
      const info = this.getTiddlerFileInfo(tiddler);
      const res = await this.saveTiddlerToFile(tiddler, info);

      await new Promise<void>((resolve, reject) =>
        $tw.utils.cleanupTiddlerFiles(
          {
            adaptorInfo: $tw.syncer.tiddlerInfo[title]?.adaptorInfo ?? {},
            bootInfo: this.boot.files[title] ?? {},
            title
          },
          e => (e ? reject(e) : resolve())
        )
      ).catch(e => console.error(e));

      if (callback) {
        callback(null, res);
      }

      return res;
    } catch (e) {
      if (
        e &&
        (e.code === 'EPERM' || e.code === 'EACCES') &&
        e.syscall === 'open'
      ) {
        const info = $tw.boot.files[title];
        info.writeError = true;
        $tw.boot.files[title] = info;
        $tw.syncer.displayError(
          `Sync for tiddler "${title}" will be retried with encoded filepath`,
          encodeURIComponent(info.filepath)
        );
      }

      this.logger.log(`Error: ${e.message}`);
      if (callback) {
        callback(e);
      }
      // throw e;
    }
  }

  public async deleteEmptyDirs(
    directory: string,
    callback?: Callback
  ): Promise<void> {
    try {
      const files = await fs.readdir(directory);
      if (files.length) {
        if (callback) {
          callback(null);
        }
      } else {
        await fs.rmdir(directory);
        await this.deleteEmptyDirs(dirname(directory));
        if (callback) {
          callback(null);
        }
      }
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
      if (callback) {
        return callback(e);
      } else {
        throw e;
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
      const info = this.boot.files[title];
      // Only delete the tiddler if we have writable information for the file
      if (info) {
        await new Promise<void>((resolve, reject) => {
          $tw.utils.deleteTiddlerFile(info, e => {
            if (e) {
              if (
                (e.code === 'EPERM' || e.code === 'EACCES') &&
                e.syscall === 'unlink'
              ) {
                // Error deleting the file on disk, should fail gracefully
                $tw.syncer.displayError(
                  'Server desynchronized. Error deleting file for deleted tiddler: ' +
                    title,
                  e
                );
                resolve();
              } else {
                reject(e);
              }
            }
            resolve();
          });
        });
      }
      if (callback) {
        callback(null);
      }
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
      if (callback) {
        callback(e);
      } else {
        throw e;
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
      // See if we've already got information about this file
      const title = tiddler.fields.title as string;
      const filters = this.wiki.getTiddlerText('$:/config/FileSystemPaths');
      const exts = this.wiki.getTiddlerText('$:/config/FileSystemExtensions');

      // Otherwise, we'll need to generate it
      const tmp = this.generateTiddlerFileInfo(tiddler, {
        directory: this.boot.wikiTiddlersPath,
        pathFilters: filters?.split('\n').filter(f => !!f),
        extFilters: exts?.split('\n').filter(f => !!f),
        wiki: this.wiki,
        fileInfo: this.boot.files[title],
        originalpath: this.wiki.extractTiddlerDataItem(
          '$:/config/OriginalTiddlerPaths',
          title,
          ''
        )
      });

      const notMarkdown = tmp.type !== 'text/x-markdown';
      const hasMetaFile =
        tmp.type !== 'application/x-tiddler' &&
        tmp.type !== 'application/json' &&
        notMarkdown;

      const info = (this.boot.files[title] = {
        ...tmp,
        hasMetaFile,
        extension: !hasMetaFile && notMarkdown ? '.tid' : tmp.extension
      });

      if (callback) {
        callback(null, info);
      } else {
        return info;
      }
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
      if (callback) {
        callback(e);
      } else {
        throw e;
      }
    }
  }

  public getTiddlerInfo(tiddler: Tiddler): FileInfo | null {
    const title = tiddler.fields.title;
    return title ? this.boot.files[title] : null ?? null;
  }

  public isReady(): boolean {
    return true;
  }

  public constructor(options: FSPlusAdaptorOptions) {
    this.wiki = options.wiki;
    this.boot = options.boot ?? $tw.boot;
    // Create the <wiki>/tiddlers folder if it doesn't exist
    $tw.utils.createDirectory($tw.boot.wikiTiddlersPath);
  }
}

export { Adaptor };
