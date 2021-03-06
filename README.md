# tiddlymark

A server-based [TiddlyWiki](https://tiddlywiki.com/) distribution for improved
Markdown support. Obviously, this makes liberal use of code loosely adapted from
TiddlyWiki's source.

Most of the codebase is a collection of TiddlyWiki plugins designed to make
things a little friendlier for folks from the mainstream JS and web dev
ecosystems.

The rest is composed of a few scripts to generate the plugin files and some
half-baked TS types for TiddlyWiki as a whole.

## Quick Start

1. Clone repository:

```
$ git clone git@github.com:noahlange/tiddlymark.git
$ cd tiddlymark
```

2. Install and generate plugins.

```
$ npm install
$ npm run dist
```

3. Link boot script and start server.

```
$ npm link
$ tiddlymark ./wiki
```

4. Optionally, symlink TiddlyWiki to make development easier.

```
$ ln -s "$(pwd)/node_modules/tiddlywiki" tiddlywiki
```

### Running the server

I have no intention to get much of this running in a client-only context; it
really operates with the assumption that you're running TiddlyWiki as a server
on `localhost`.

Some peculiarities in how TiddlyWiki handles file loading/deserialization make
custom deserializers inordinately difficult; these behaviors needed to be
overwritten at the JS level.

To get everything running properly, you'll need to run the CLI script in
`bin/serve` (or, after running `npm link`, use the `tiddlymark` command).

The updated CLI will add all the plugins in `./wiki/plugins`, create a
deserializer tiddler if necessary and boot the server, using the user's git
username as the wiki's anonymous username.

### Included plugins

| Plugin        |                                                     |
| :------------ | :-------------------------------------------------- |
| fs-plus       | Write metadata to YAML front-matter in `.md` files. |
| markdown-plus | "Native" markdown renderer.                         |
| monaco        | Enable the monaco text editor.                      |
| pretty        | Prettify files on save.                             |
| sass          | Compile SASS files into a CSS stylesheet tiddler.   |

#### fs-plus

Adjusts the standard file-system adapter to embed metadata as YAML into the
front-matter of Markdown files, which are then saved as `.md`. Also provides a
deserializer that reads these files back into a format TiddlyWiki understands.

Helps manage some file clutter and (more importantly) gives us regular Markdown
files. These can then be committed and viewed on GitHub or whatevered.

#### markdown-plus

Alternative parser/renderer that uses `simple-markdown` to build a JsonML tree
instead of generating raw HTML. We can then take advantage of TiddlyWiki's HTML
rendering features that would otherwise be unavailable to us&mdash;macros,
link-checking, &amp;c.

Also includes a few syntax extensions for:

- HTML entities (e.g., `&rarr;`)
- emojis (e.g., `:smile:`)
- ` <div>` containers (fences with `:::` instead of backticks)
- subscript and superscript (e.g., `~sub~`, `^super^`)
- insert (`++ins++`)
- inline and block macros (e.g., `<<sayhi>>`)

Unlike the stock Markdown plugin, link targets and image sources _don't_ require
a preceding `#`.

#### sass

Compiles `.scss` files tagged with `$:/tags/Stylesheet` into a hidden CSS
tiddler, which is then inserted into the DOM like other stylesheets. Requires a
page template override to avoid inserting the SASS source as CSS.

#### pretty

Adds a save hook to run [prettier](https://prettier.io) on XML, Markdown,
JavaScript/TypeScript and CSS/SCSS/LESS/PostCSS on save. There's a slight pause
upon save, but I'll take that over having to manually reformat content and/or
have it be ugly.

#### monaco

A pretty straightforward [Monaco](https://github.com/Microsoft/monaco-editor)
integration, which I (personally) like a lot more than Ace and CodeMirror.

### Custom plugins

You can use the build scripts to generate custom plugins. Each plugin gets a
standalone directory in `plugins` with a webpack config and `index.js` that
serves as a "manifest" with the appropriate content and config.

Plugins you'd like to keep in the `plugins` directory but don't want to build
can be placed in directories prefixed with `.`. The build tasks will ignore
them.

#### webpack.config.js

Custom configuration for webpack goes in a `webpack.config.js` file to be merged
with the common `webpack.config.js` file at the project root. Things to note:

1. Your `target` depends on where you to run the code. Generally speaking,
   common or client-side code should use `web`; explicitly server-side code
   should use `node` instead. That being said, that's not always the case—it can
   get a little complicated.
2. Compiled files are dumped into `./build`.
3. Use `require()` for runtime imports/exports (e.g., TiddlyWiki modules) and
   ES6 imports for bundled libraries, &c. The semantics of TW's `require()` are
   pretty close to standard CommonJS—any rate, I haven't run into any major
   surprises.

#### index.js

A plain JS file that exports an object roughly corresponding to the file
structure of your plugin. Whatever the structure, the plugin's contents will
always be nested under `$:/plugins`.

Any given tiddler is represented by as key in an object hash. Each key in _that_
object represents a single data/metadata field. The values must be directly
serializable to JSON—or Promises of objects directly serializable to JSON.

The `_` key does not hold a metadata value, but instead is a container for
nested tiddlers.

#### Building plugins

To generate plugins during development, run `npm run build`. `npm run dist` is
significantly more resource-intensive and intended for production builds.

In either case, the generated files are copied to `wiki/plugins`.
